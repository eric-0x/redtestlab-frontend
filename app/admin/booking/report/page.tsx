"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Edit3,
  Save,
  Plus,
  Trash2,
  Bot,
  Loader2,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSearchParams } from "next/navigation";
import React from "react";
import axios from "axios";
import { Suspense } from "react";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI("AIzaSyDGD5Us-NdIV7ngcFpM0I_rkUbFJjqsalg");

// QR Code component
const QRCode = ({ value, size = 100 }: any) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}`;

  return (
    <img
      src={qrCodeUrl || "/placeholder.svg"}
      alt="QR Code"
      className="border border-gray-300 rounded"
      width={size}
      height={size}
    />
  );
};

const MedicalReportGenerator = () => {
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    age: 42,
    gender: "Male",
    sampleId: "LAB-2025-7890",
    collectionDate: "2025-06-24",
    reportDate: "2025-06-25",
  });

  const [labData, setLabData] = useState({
    name: "RedTest Laboratories",
    addressLine: "123 Health Street",
    cityPincode: "Patna, Bihar - 800001",
  });

  const [testResults, setTestResults] = useState([
    {
      testName: "Hemoglobin (Hb)",
      result: "14.2",
      unit: "g/dL",
      refRange: "13.5–17.5",
      status: "Normal",
    },
    {
      testName: "WBC Count",
      result: "8,500",
      unit: "cells/µL",
      refRange: "4,000–11,000",
      status: "Normal",
    },
    {
      testName: "Platelets",
      result: "210,000",
      unit: "/µL",
      refRange: "150,000–450,000",
      status: "Normal",
    },
    {
      testName: "Fasting Glucose",
      result: "110",
      unit: "mg/dL",
      refRange: "70–99",
      status: "High",
    },
    {
      testName: "Serum Creatinine",
      result: "1.4",
      unit: "mg/dL",
      refRange: "0.7–1.3",
      status: "High",
    },
    {
      testName: "ALT (Liver Enzyme)",
      result: "50",
      unit: "IU/L",
      refRange: "8–37",
      status: "High",
    },
    {
      testName: "TSH",
      result: "2.1",
      unit: "mIU/L",
      refRange: "0.4–4.0",
      status: "Normal",
    },
  ]);

  const [interpretation, setInterpretation] =
    useState(`Elevated Fasting Glucose (110 mg/dL): Suggests prediabetes; recommend HbA1c test for confirmation.
High Creatinine (1.4 mg/dL): Indicates potential kidney dysfunction; advise renal function panel.
Increased ALT (50 IU/L): Possible liver inflammation; suggest ultrasound and viral hepatitis screening.`);

  const [comments, setComments] = useState(`No critical abnormalities detected.
Follow-up recommended for:
• Diabetes risk assessment
• Kidney and liver function monitoring`);

  const [isEditingInterpretation, setIsEditingInterpretation] = useState(false);
  const [isEditingComments, setIsEditingComments] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportLink, setReportLink] = useState<string | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState(false);

  const searchParams = useSearchParams();
  // On mount, update patientData from query params if present
  React.useEffect(() => {
    const name = searchParams.get("name");
    const age = searchParams.get("age");
    const gender = searchParams.get("gender");
    if (name || age || gender) {
      setPatientData((prev) => ({
        ...prev,
        name: name || prev.name,
        age: age ? Number(age) : prev.age,
        gender: gender || prev.gender,
      }));
    }
  }, [searchParams]);

  // Generate AI interpretation using Gemini
  const generateGeminiInterpretation = async () => {
    setIsGeneratingAI(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const abnormalTests = testResults.filter(
        (test) => test.status === "High" || test.status === "Low"
      );
      const testSummary = testResults
        .map(
          (test) =>
            `${test.testName}: ${test.result} ${test.unit} (Ref: ${test.refRange}) - ${test.status}`
        )
        .join("\n");

      const prompt = `You are a medical AI assistant. Analyze these lab test results and provide a concise medical interpretation in exactly 5 lines or less. Focus on abnormal values and their clinical significance:

${testSummary}

Patient: ${patientData.name}, Age: ${patientData.age}, Gender: ${patientData.gender}

Provide a brief, professional medical interpretation focusing on abnormal findings and recommendations. Keep it under 5 lines.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiInterpretation = response.text();

      setInterpretation(aiInterpretation);

      // Generate comments based on abnormal findings
      if (abnormalTests.length > 0) {
        const followUpPrompt = `Based on these abnormal lab results, provide brief follow-up recommendations in 3 lines or less:
${abnormalTests
  .map(
    (test) => `${test.testName}: ${test.result} ${test.unit} - ${test.status}`
  )
  .join("\n")}`;

        const followUpResult = await model.generateContent(followUpPrompt);
        const followUpResponse = await followUpResult.response;
        setComments(followUpResponse.text());
      } else {
        setComments(
          "All test results are within normal limits. Continue routine health maintenance and follow-up as recommended by your healthcare provider."
        );
      }
    } catch (error) {
      console.error("Error generating AI interpretation:", error);
      setInterpretation(
        "Unable to generate AI interpretation at this time. Please review results manually."
      );
      setComments(
        "Please consult with your healthcare provider for proper interpretation of these results."
      );
    }
    setIsGeneratingAI(false);
  };

  // API call to create report
  const createReport = async () => {
    setIsCreatingReport(true);
    try {
      const response = await axios.post(
        "https://redtestlab.com/api/report/create",
        {
          name: patientData.name,
        }
      );
      // Assuming response.data = { reportId: string, link: string }
      setReportId(response.data.reportId);
      setReportLink(response.data.link);
    } catch (error) {
      alert("Failed to create report. Please try again.");
      setReportId(null);
      setReportLink(null);
    }
    setIsCreatingReport(false);
  };

  const addTestResult = () => {
    setTestResults([
      ...testResults,
      { testName: "", result: "", unit: "", refRange: "", status: "Normal" },
    ]);
  };

  interface TestResult {
    testName: string;
    result: string;
    unit: string;
    refRange: string;
    status: "Normal" | "High" | "Low";
  }

  type TestResultField = keyof TestResult;

  const updateTestResult = (
    index: number,
    field: TestResultField,
    value: string
  ) => {
    const updated = [...testResults];
    updated[index][field] = value;
    setTestResults(updated);
  };

  const deleteTestResult = (index: number) => {
    setTestResults(testResults.filter((_, i) => i !== index));
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Medical Report Generator
            </h1>
            <div className="flex gap-3">
              <button
                onClick={generateGeminiInterpretation}
                disabled={isGeneratingAI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                {isGeneratingAI ? "Generating..." : "AI Interpretation"}
              </button>
              <button
                onClick={printReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Generate PDF
              </button>
              <button
                onClick={createReport}
                disabled={isCreatingReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isCreatingReport ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isCreatingReport ? "Creating..." : "Create Report"}
              </button>
            </div>
          </div>

          {/* Patient Data Form */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) =>
                    setPatientData({ ...patientData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      age: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={patientData.gender}
                  onChange={(e) =>
                    setPatientData({ ...patientData, gender: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample ID
                </label>
                <input
                  type="text"
                  value={patientData.sampleId}
                  onChange={(e) =>
                    setPatientData({ ...patientData, sampleId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Date
                </label>
                <input
                  type="date"
                  value={patientData.collectionDate}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      collectionDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={patientData.reportDate}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      reportDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Lab Information Form */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Lab Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lab Name
                </label>
                <input
                  type="text"
                  value={labData.name}
                  onChange={(e) =>
                    setLabData({ ...labData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  value={labData.addressLine}
                  onChange={(e) =>
                    setLabData({ ...labData, addressLine: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City, State - Pincode
                </label>
                <input
                  type="text"
                  value={labData.cityPincode}
                  onChange={(e) =>
                    setLabData({ ...labData, cityPincode: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Test Results Management */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Test Results
              </h3>
              <button
                onClick={addTestResult}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Test
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Test Name
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Result
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Unit
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Reference Range
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={test.testName}
                          onChange={(e) =>
                            updateTestResult(index, "testName", e.target.value)
                          }
                          className="w-full border-none focus:outline-none text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={test.result}
                          onChange={(e) =>
                            updateTestResult(index, "result", e.target.value)
                          }
                          className="w-full border-none focus:outline-none text-sm font-semibold"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={test.unit}
                          onChange={(e) =>
                            updateTestResult(index, "unit", e.target.value)
                          }
                          className="w-full border-none focus:outline-none text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={test.refRange}
                          onChange={(e) =>
                            updateTestResult(index, "refRange", e.target.value)
                          }
                          className="w-full border-none focus:outline-none text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <select
                          value={test.status}
                          onChange={(e) =>
                            updateTestResult(index, "status", e.target.value)
                          }
                          className="w-full border-none focus:outline-none text-sm"
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Low">Low</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <button
                          onClick={() => deleteTestResult(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white shadow-lg" id="report-content">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #report-content, #report-content * {
                visibility: visible;
              }
              #report-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 20px;
                box-shadow: none;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          {/* Header */}
          <div className="border-b-2 border-black p-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-end">
                <img
                  src="https://res.cloudinary.com/dtcucixii/image/upload/v1750265141/Redtest_lab_logo_luyjlk.jpg"
                  alt="RedTest Lab Logo"
                  className="h-12 w-auto object-contain mb-2"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">
                  Report ID: {patientData.sampleId}
                </p>
                <p className="text-xs text-gray-600">
                  Date: {patientData.reportDate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Patient Information */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                PATIENT INFORMATION
              </h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-semibold">{patientData.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Age:</span>
                  <span className="ml-2 font-semibold">
                    {patientData.age} years
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <span className="ml-2 font-semibold">
                    {patientData.gender}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Sample ID:</span>
                  <span className="ml-2 font-semibold">
                    {patientData.sampleId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Collection Date:</span>
                  <span className="ml-2 font-semibold">
                    {patientData.collectionDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Report Date:</span>
                  <span className="ml-2 font-semibold">
                    {patientData.reportDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                LABORATORY RESULTS
              </h2>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                      Test Name
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                      Result
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                      Unit
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                      Reference Range
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {test.testName}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs font-semibold">
                        {test.result}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {test.unit}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {test.refRange}
                      </td>
                      <td
                        className={`border border-gray-300 px-3 py-2 text-xs font-semibold ${
                          test.status === "High" || test.status === "Low"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {test.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interpretation */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
                  INTERPRETATION
                </h2>
                <button
                  onClick={() =>
                    setIsEditingInterpretation(!isEditingInterpretation)
                  }
                  className="text-blue-600 hover:text-blue-800 no-print"
                >
                  {isEditingInterpretation ? (
                    <Save className="w-3 h-3" />
                  ) : (
                    <Edit3 className="w-3 h-3" />
                  )}
                </button>
              </div>
              {isEditingInterpretation ? (
                <textarea
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  className="w-full h-24 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 no-print text-xs"
                  placeholder="Enter medical interpretation..."
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-3">
                  <pre className="whitespace-pre-wrap text-xs text-gray-800 leading-relaxed">
                    {interpretation}
                  </pre>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
                  COMMENTS
                </h2>
                <button
                  onClick={() => setIsEditingComments(!isEditingComments)}
                  className="text-blue-600 hover:text-blue-800 no-print"
                >
                  {isEditingComments ? (
                    <Save className="w-3 h-3" />
                  ) : (
                    <Edit3 className="w-3 h-3" />
                  )}
                </button>
              </div>
              {isEditingComments ? (
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full h-20 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 no-print text-xs"
                  placeholder="Enter additional comments..."
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-3">
                  <pre className="whitespace-pre-wrap text-xs text-gray-800 leading-relaxed">
                    {comments}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {labData.name}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {labData.addressLine}
                </p>
                <p className="text-sm text-gray-600">{labData.cityPincode}</p>
              </div>
              <div className="text-center">
                <QRCode value={reportLink} size={100} />
                {/* <p className="text-xs text-gray-600 mt-1">Scan to verify</p>
                {reportLink && (
                  <a
                    href={reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline text-xs mt-1 break-all"
                  >
                    {reportLink}
                  </a>
                )} */}
              </div>
            </div>
            <div className="border-t border-gray-300 mt-4 pt-3 text-center">
              <p className="text-xs text-gray-600">
                This report is computer generated and does not require
                signature. For queries, visit redtestlabs.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ReportPageWithParams() {
  return <MedicalReportGenerator />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportPageWithParams />
    </Suspense>
  );
}
