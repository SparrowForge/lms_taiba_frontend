"use client";

import { ClockCircleOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { Pagination, Table, Tag, Progress, Button } from "antd";
import { useSubjects } from "@/hooks/useSubjects";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";

const MyCourcesList = () => {
  const { t } = useLocalization();
  const { subjects, listStatus, loadSubjects, pagination } = useSubjects();

  // Load subjects when component mounts
  useEffect(() => {
    loadSubjects({ page: 1, limit: 5 });
  }, [loadSubjects]);

  if (listStatus.status === "LOADING") {
    return <p className="text-center">Loading subjects...</p>;
  }

  if (!subjects || subjects.length === 0) {
    return <p className="text-center">No subjects found.</p>;
  }

  // Define table columns
  const columns = [
    {
      title: t(LOCALE_KEYS.SUBJECT_NAME),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: t(LOCALE_KEYS.STATUS),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t(LOCALE_KEYS.PROGRESS),
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Progress percent={progress ?? 0} size="small" />
      ),
    },
    // {
    //   title: t(LOCALE_KEYS.UNITS),
    //   dataIndex: "units",
    //   key: "units",
    //   render: (units: number) => <span>{units ?? 0} Units</span>,
    // },
    // {
    //   title: t(LOCALE_KEYS.TIME),
    //   dataIndex: "time",
    //   key: "time",
    //   render: (time: string) => (
    //     <span className="flex items-center gap-1">
    //       <ClockCircleOutlined /> {time || "N/A"}
    //     </span>
    //   ),
    // },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="primary" ghost size="small">
          {t(LOCALE_KEYS.OPEN_SUBJECT)}
        </Button>
      ),
    },
  ];

  return (
    <div className="my-10">
      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        pagination={false} // we'll use custom pagination below
      />

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={pagination?.currentPage || 1}
          pageSize={pagination?.perPage || 5}
          total={pagination?.total || 0}
          onChange={(page, pageSize) => {
            loadSubjects({ page, limit: pageSize });
          }}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default MyCourcesList;
