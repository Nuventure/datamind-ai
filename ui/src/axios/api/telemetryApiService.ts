import { apiClient } from "../axiosConfig";
import { Endpoints } from "../endpoints/endpoints";

export const telemetryApiService = {
  uploadTelemetryFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post(Endpoints.sheets.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
