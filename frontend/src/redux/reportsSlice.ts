import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../constants/constants";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { setNotification } from "./notificationSlice";

export interface Report {
  id: string;
  sender_name: string;
  age: number;
  job: string;
  file_url?: string;
}

interface ReportsState {
  reports: Report[];
  reportDetail: Report | null;
  status: string;
  detailStatus: string;
}

const initialState: ReportsState = {
  reports: [],
  reportDetail: null,
  status: "idle",
  detailStatus: "idle",
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchReportDetail = createAsyncThunk<Report, string>(
  "reports/fetchReportDetail",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/${id}`);
      return response.data;
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error fetching report details.",
          severity: "error",
        })
      );
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reports`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(
        setNotification({
          message: "Report created successfully!",
          severity: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error creating report.",
          severity: "error",
        })
      );
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateReport = createAsyncThunk(
  "reports/updateReport",
  async (
    { id, updatedData }: { id: string; updatedData: FormData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/reports/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(
        setNotification({
          message: "Report updated successfully!",
          severity: "success",
        })
      );
      return res.data;
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error updating report.",
          severity: "error",
        })
      );
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${API_BASE_URL}/reports/${id}`);
      dispatch(
        setNotification({
          message: "Report deleted successfully!",
          severity: "success",
        })
      );
      return id;
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error deleting report.",
          severity: "error",
        })
      );
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state) => {
        state.status = "failed";
      });

    // Fetch single report detail
    builder
      .addCase(fetchReportDetail.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchReportDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.reportDetail = action.payload;
      })
      .addCase(fetchReportDetail.rejected, (state) => {
        state.detailStatus = "failed";
      });

    // Create a report
    builder.addCase(createReport.fulfilled, (state, action) => {
      state.reports.push(action.payload);
    });

    // Update a report
    builder.addCase(updateReport.fulfilled, (state, action) => {
      const { id, updatedData } = action.payload;

      const index = state.reports.findIndex((report) => report.id === id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...updatedData };
      }
      if (state.reportDetail?.id === id) {
        state.reportDetail = { ...state.reportDetail, ...updatedData };
      }
    });

    // Delete a report
    builder.addCase(deleteReport.fulfilled, (state, action) => {
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload
      );
      if (state.reportDetail?.id === action.payload) {
        state.reportDetail = null;
      }
    });
  },
});

export default reportsSlice.reducer;
