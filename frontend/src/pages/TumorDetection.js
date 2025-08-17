import React, { useState } from "react";
import { toast } from "react-toastify";
import { mlService } from "../utils/auth";
import DownloadReport from "./DownloadReports";

const TumorDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an MRI image first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const result = await mlService.predictTumor(formData);
      if (result.success) {
        setPrediction(result.data);
        toast.success("MRI analysis completed successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to analyze MRI image");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPrediction(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-brain me-3"></i>
          Brain Tumor Detection
        </h1>
        <button className="btn btn-outline-secondary" onClick={resetForm}>
          <i className="fas fa-refresh me-2"></i>
          Start New Analysis
        </button>
      </div>

      <div className="row">
        {/* Upload Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-upload me-2"></i>
                Upload MRI Image
              </h5>
            </div>
            <div className="card-body">
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded p-5 text-center ${
                    dragActive ? "border-primary bg-light" : "border-secondary"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ minHeight: "300px", cursor: "pointer" }}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <i className="fas fa-cloud-upload-alt fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted mb-3">
                      Drop your MRI image here or click to browse
                    </h5>
                    <input
                      type="file"
                      className="d-none"
                      id="fileInput"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="fileInput" className="btn btn-primary">
                      <i className="fas fa-folder-open me-2"></i>
                      Choose File
                    </label>
                    <small className="text-muted mt-3">
                      Supported formats: PNG, JPG, JPEG, GIF, BMP, TIFF
                      <br />
                      Maximum file size: 16MB
                    </small>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected MRI"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", maxWidth: "100%" }}
                    />
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold">{selectedFile.name}</h6>
                    <small className="text-muted">
                      Size: {selectedFile.size / 1024 / 1024} MB
                    </small>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-brain me-2"></i>
                          Analyze for Brain Tumor
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      <i className="fas fa-times me-2"></i>
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Analysis Results
              </h5>
            </div>
            <div className="card-body">
              {!prediction ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                  <i className="fas fa-brain fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted mb-3">No Analysis Yet</h5>
                  <p className="text-muted">
                    Upload an MRI image to get AI-powered brain tumor detection
                    results.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Main Result */}
                  <div className="text-center mb-4">
                    <div
                      className={`badge fs-4 p-3 mb-3 ${
                        prediction.data.prediction !== "notumor"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {prediction.data.prediction !== "notumor"
                        ? "Tumor Detected"
                        : "No Tumor Detected"}
                    </div>
                    <div className="progress mb-2" style={{ height: "20px" }}>
                      <div
                        className={`progress-bar ${
                          prediction.data.prediction !== "notumor"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                        style={{ width: `${prediction.data.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-muted">
                      Confidence: {prediction.data.confidence.toFixed(1)}%
                    </p>
                  </div>

                  {/* Predicted Class */}
                  <div className="row text-center mb-4">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-info">Predicted Class</h6>
                        <h4 className="text-info">
                          {prediction.data.prediction}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="alert alert-info">
                    <h6 className="alert-heading">
                      <i className="fas fa-info-circle me-2"></i>
                      Recommendation
                    </h6>
                    {prediction.confidence > 50 ? (
                      <p className="mb-0">
                        The AI model has detected potential abnormalities.
                        Please consult with a neurologist immediately for
                        further evaluation and proper medical assessment.
                      </p>
                    ) : (
                      <p className="mb-0">
                        The AI analysis suggests no tumor is present. However,
                        continue with regular check-ups as recommended by your
                        healthcare provider.
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary">
                      <i className="fas fa-calendar-plus me-2"></i>
                      Book Consultation
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={DownloadReport}
                    >
                      <i className="fas fa-download me-2"></i>
                      Download Report
                    </button>

                    {/* <DownloadReport
                      user={currentUser}
                      prediction={predictionData}
                    /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Information */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-robot me-2"></i>
                AI Model Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <h6 className="fw-bold">Model Type</h6>
                  <p className="text-muted">
                    Convolutional Neural Network (CNN)
                  </p>
                </div>
                <div className="col-md-3">
                  <h6 className="fw-bold">Accuracy</h6>
                  <p className="text-muted">94.5%</p>
                </div>
                <div className="col-md-3">
                  <h6 className="fw-bold">Input Size</h6>
                  <p className="text-muted">128x128 pixels</p>
                </div>
                <div className="col-md-3">
                  <h6 className="fw-bold">Version</h6>
                  <p className="text-muted">v1.0</p>
                </div>
              </div>
              <div className="alert alert-warning mb-0">
                <strong>Important:</strong> This AI analysis is for screening
                purposes only and should not replace professional medical
                diagnosis. Always consult with qualified healthcare
                professionals for medical decisions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TumorDetection;
