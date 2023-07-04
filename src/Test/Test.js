import { Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { TGCRMContext } from "../Context/Context";
import dayjs from "dayjs";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
function Test() {
  const {
    PerformanceData,
    getPerformance,
    LeadsData,
    getLeads,
    getStatus,
    StatusData,
    AuthUser,
  } = useContext(TGCRMContext);
  const [PD, setPD] = useState([]);
  const [LD, setLD] = useState([]);
  const [SD, setSD] = useState([]);
  const [PerformanceTable, setPerformanceTable] = useState([]);
  const [analyticsDateFilter, setanalyticsDateFilter] = useState([
    dayjs().format("DD-MM-YYYY"),
    dayjs().format("DD-MM-YYYY"),
  ]);
  const [Status_count, setStatus_count] = useState({
    active: 0,
    followUps: 0,
    interested: 0,
  });
  useEffect(() => {
    if (AuthUser) {
      const UserPerformance = PerformanceData.filter((item) =>
        dayjs(item.res_date, "DD-MM-YYYY").isBetween(
          dayjs(analyticsDateFilter[0], "DD-MM-YYYY)"),
          dayjs(analyticsDateFilter[1], "DD-MM-YYYY)"),
          "DD-MM-YYYY",
          "[]"
        )
      );
      setPerformanceTable(UserPerformance);
      setPD(PerformanceData);
    }
  }, [getPerformance]);
  useEffect(() => {
    setLD(LeadsData);
  }, [getLeads]);
  useEffect(() => {
    setSD(StatusData);
  }, [getStatus]);

  let newTD;
  const countFunction = () => {
    const NewStatus = { ...Status_count };
    NewStatus.active = 0;
    NewStatus.followUps = 0;
    NewStatus.interested = 0;
    PerformanceTable.forEach((performance) => {
      const { staff_name, lead_status } = performance;

      // Find the matching status object with admin_count set to "yes"
      const activecount = SD.find(
        (status) =>
          status.name.toLowerCase() === lead_status.toLowerCase() &&
          status.admin_count === "yes"
      );
      const followcount = SD.find(
        (status) =>
          status.name.toLowerCase() === lead_status.toLowerCase() &&
          status.followup_count === "yes"
      );

      if (activecount) {
        // Increment the Active count
        NewStatus.active += 1;
      }
      if (followcount) {
        // Increment the Active count
        NewStatus.followUps += 1;
      }
      if (lead_status.toLowerCase() === "interested") {
        // Increment the Active count
        NewStatus.interested += 1;
      }
    });
    setStatus_count(NewStatus);

    console.log(NewStatus);
  };
  const columns = [
    {
      title: "Staff Name",
      dataIndex: "staff_name",
      width: "15%",
      editable: true,
    },
    {
      title: "status",
      dataIndex: "lead_status",
      width: "15%",
      editable: true,
    },
    {
      title: "followUps",
      dataIndex: "res_date",
      width: "15%",
      editable: true,
    },
    {
      title: "lead name",
      dataIndex: "lead_comment",
      width: "15%",
      editable: true,
    },
  ];
  return (
    <div>
      <button onClick={countFunction}>click</button>
      <Table bordered dataSource={PerformanceTable} columns={columns} />
    </div>
  );
}

export default Test;
