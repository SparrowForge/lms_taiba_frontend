"use client"
import React, { useEffect, useState } from 'react';
const Feetables = ({ filterType }) => {
  const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    fetch('/FeeData.json')
      .then((res) => res.json())
      .then((data) => setFeeData(data))
      .catch((err) => console.error("Failed to fetch fee data:", err));
  }, []);

  // Filter for menu
  const filteredData = filterType
    ? feeData.filter((item) => item.type === filterType)
    : feeData;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[14px] text-left border border-[#333333]/20">
        <thead className="text-[#333333]/70 bg-gray-100">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Fee Structure</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(({ id, structure, type, amount, status }) => (
            <tr key={id} className="text-start hover:bg-gray-50 text-[12px]">
              <td className="px-6 py-3">{id}</td>
              <td className="px-6 py-3">{structure}</td>
              <td className="px-6 py-3">{type}</td>
              <td className="px-6 py-3">{amount}</td>
              <td className="px-6 py-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    status === "Draft"
                      ? "bg-gray-100 text-black border border-[#333333]/20"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {status}
                </span>
              </td>
              <td className="px-6 py-3">
                <button className="text-sm cursor-pointer">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feetables;
