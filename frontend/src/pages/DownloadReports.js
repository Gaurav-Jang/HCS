// DownloadReports.js
import jsPDF from "jspdf";

const DownloadReports = ({ user, prediction, uploadedImageUrl }) => {
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("MRI Tumor Detection Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 35);
    doc.text(`Email: ${user.email}`, 20, 45);

    doc.text(`Prediction: ${prediction.data.prediction}`, 20, 60);
    doc.text(`Confidence: ${prediction.data.confidence.toFixed(2)}%`, 20, 70);

    doc.text(`Model: VGG16 Transfer Learning`, 20, 85);
    doc.text(`Accuracy: 97.22%`, 20, 95);
    doc.text(`Class Labels: pituitary, glioma, meningioma, notumor`, 20, 105);

    const img = document.getElementById("uploaded-mri");
    if (img) {
      doc.addImage(img, "JPEG", 20, 115, 160, 120);
    }

    doc.save("MRI_Tumor_Report.pdf");
  };

  return (
    <div>
      <button className="btn btn-outline-primary" onClick={downloadReport}>
        <i className="fas fa-download me-2"></i>
        Download Report
      </button>

      <img
        id="uploaded-mri"
        src={uploadedImageUrl}
        alt="MRI"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default DownloadReports;
