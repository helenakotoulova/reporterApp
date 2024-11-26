import { Router } from "express";
import multer from "multer";
import { supabase } from "../db";

const sanitizeFileName = (fileName: string): string =>
  fileName
    .normalize("NFKD")
    .replace(/[\s,]+/g, "_")
    .replace(/[^\w.-]/g, "");

const uploadFile = async (file: Express.Multer.File) => {
  const sanitizedFileName = sanitizeFileName(file.originalname);
  const encodedFileName = encodeURIComponent(sanitizedFileName);

  const { error: uploadError } = await supabase.storage
    .from("reports_files")
    .upload(`public/${encodedFileName}`, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("reports_files")
    .getPublicUrl(`public/${encodedFileName}`);

  return publicUrlData.publicUrl;
};

const removeFile = async (fileUrl: string) => {
  const filePath = fileUrl.split("/public/")[1];
  await supabase.storage.from("reports_files").remove([filePath]);
};

const fetchReportById = async (id: string) => {
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !report) throw new Error("Report not found");
  return report;
};

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data: reports, error } = await supabase.from("reports").select("*");

    if (error) throw new Error(error.message);

    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const report = await fetchReportById(req.params.id);

    if (report.file_url) {
      const filePath = report.file_url.split(
        "/storage/v1/object/public/reports_files"
      )[1];
      const { data: file, error } = await supabase.storage
        .from("reports_files")
        .download(filePath);

      if (error) throw new Error("Error fetching file from storage");

      const fileBuffer = await file.arrayBuffer();
      report.file = Buffer.from(fileBuffer).toString("base64");
    }

    res.json(report);
  } catch (err: any) {
    res.status(err.message === "Report not found" ? 404 : 500).json({
      error: err.message || "Internal server error",
    });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { sender_name, age, job } = req.body;
    const file = req.file;

    let fileUrl = null;

    if (file) fileUrl = await uploadFile(file);

    const { error: dbError, data } = await supabase
      .from("reports")
      .insert([
        {
          sender_name,
          age,
          job,
          file_url: fileUrl,
        },
      ])
      .select("*");

    if (dbError) throw new Error(dbError.message);

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { sender_name, age, job, remove_file } = req.body;
    const file = req.file;

    const originalReport = await fetchReportById(req.params.id);

    if (!originalReport) {
      throw new Error("Report not found");
    }

    let fileUrl = originalReport.file_url;

    if (remove_file === "true" && originalReport.file_url) {
      await removeFile(originalReport.file_url);
      fileUrl = null;
    }

    if (file) {
      fileUrl = await uploadFile(file);
      if (originalReport.file_url) {
        await removeFile(originalReport.file_url);
      }
    }

    const { error: updateError, data } = await supabase
      .from("reports")
      .update({ sender_name, age, job, file_url: fileUrl })
      .eq("id", req.params.id)
      .select("*");

    if (updateError) {
      throw new Error(updateError.message);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(err.message === "Report not found" ? 404 : 500).json({
      error: err.message || "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const report = await fetchReportById(req.params.id);

    if (report.file_url) await removeFile(report.file_url);

    const { error: deleteError } = await supabase
      .from("reports")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw new Error(deleteError.message);

    res.status(200).json({ message: "Report deleted successfully!" });
  } catch (err: any) {
    res.status(err.message === "Report not found" ? 404 : 500).json({
      error: err.message || "Internal server error",
    });
  }
});

export default router;
