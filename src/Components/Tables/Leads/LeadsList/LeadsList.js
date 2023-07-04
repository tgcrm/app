import { Form, Input, InputNumber, Table, Tag } from "antd";
import dayjs from "dayjs";

import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import { DatePicker, message } from "antd";

import { Link, useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { TGCRMContext } from "../../../../Context/Context";

import RegistrationForm from "../../../Froms/RegistrationForm/RegistrationForm";
import axios from "axios";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const LeadsList = () => {
  const location = useLocation();
  const {
    getMember,
    memberData,
    getLeads,
    LeadsData,
    getStatus,
    StatusData,
    SourcesData,
    CourseData,
  } = useContext(TGCRMContext);
  const [Users, setUsers] = useState([]);
  const [assignedMembers, setassignedMembers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [Leads, setLeads] = useState([]);
  const [NewStatus, setNewStatus] = useState([]);
  const [NewCourse, setNewCourse] = useState([]);
  const [NewSourceData, setNewSourceData] = useState([]);
  // Access the current pathname, search, and hash
  const { pathname } = location;
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [Path, setPath] = useState("");
  const [OpenFilter, setOpenFilter] = useState(false);
  const [OpenRegForm, setOpenRegForm] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [TableData, setTableData] = useState([]);
  const [assign_to, setassign_to] = useState([]);
  const [date, setDate] = useState(null);
  const [create_date_object, setcreate_date_object] = useState([]);
  const [isTask, setisTask] = useState(false);
  const [TaskType, setTaskType] = useState("assign");
  const [FormData, setFormData] = useState({
    name: [],
    gender: [],
    status: [],
    mobile: [],
    source: [],
    dob: "",
    role: [],
    course: [],
    date: [],
    assigned_under: [],
    assigned_to: [],
    address: [],
  }); // eslint-disable-next-line

  ///////////Row Selection//////////////
  const [selectionType, setSelectionType] = useState("manual");
  const [selectedRows, setSelectedRows] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [selectedData, setselectedData] = useState([]);
  const [selectedRowsKey, setSelectedRowsKey] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const get_location = () => {
      let p_name = pathname.split("/");
      console.log(p_name);
      if (p_name.length > 2) {
        setPath(p_name[2].toUpperCase());
      } else {
        setPath(p_name[1].toUpperCase());
      }
    };
    get_location();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const strAscending = [...memberData].sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    setUsers(memberData);
    setTableData(strAscending);

    const data = memberData.filter((item) => {
      return item.role === "admin";
    });
    console.log("Admins", data);
    setAdminUsers(data);
  }, [getMember]);

  useEffect(() => {
    const newArray = LeadsData.map((obj, index) => {
      return { ...obj, ["key"]: index };
    });
    setNewCourse(CourseData);
    setNewSourceData(SourcesData);
    setNewStatus(StatusData);
    setLeads(newArray);
    setTableData(newArray);
  }, [getLeads]);

  const success = () => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-green-600 mr-2">
              <FaCheck />
            </div>
            <div className=" text-green-600"> Leads Assigned Successfully</div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };
  const errorMsg = (msg) => {
    messageApi.open({
      content: (
        <div className="flex flex-col gap-3">
          <div className=" flex justify-start items-center text-lg">
            <div className=" w-6 h-6 text-white flex text-base items-center justify-center rounded-full bg-red-600 mr-2">
              X
            </div>
            <div className="font-bold text-red-600">{msg}</div>
          </div>
        </div>
      ),
      className: "mt-10",
      icon: null,
    });
  };

  const handleFullName = (select) => {
    const newData = { ...FormData };
    newData.name = select;

    setFormData(newData);
  };

  const handleGender = (e) => {
    const newData = { ...FormData };
    newData.gender = e;
    setFormData(newData);
  };

  const handleStatus = (e) => {
    const newData = { ...FormData };
    newData.status = e;
    setFormData(newData);
  };

  const handlePhoneNo = (e) => {
    const newData = { ...FormData };
    newData.mobile = e;
    setFormData(newData);
  };

  const handleFathersName = (e) => {
    const newData = { ...FormData };
    newData.source = e;
    setFormData(newData);
  };

  const handleDOB = (date, datestring) => {
    const newData = { ...FormData };
    newData.dob = datestring;
    setDate(date);
    setFormData(newData);
  };

  const handleRole = (e) => {
    const newData = { ...FormData };
    newData.role = e;
    setFormData(newData);
  };

  const handleCourse = (e) => {
    const newData = { ...FormData };
    newData.course = e;
    setFormData(newData);
  };

  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };

  const handleAssignedUnder = (e) => {
    const newData = { ...FormData };
    newData.assigned_under = e;
    setFormData(newData);
  };

  const handleAssignedBy = (e) => {
    const newData = { ...FormData };

    newData.assigned_to = e;
    setFormData(newData);
  };

  const handleAddress = (e) => {
    const newData = { ...FormData };
    newData.address = e;
    setFormData(newData);
  };

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: <span className="font-bold">Name</span>,
      width: "18%",
      editable: true,
      dataIndex: "name",
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.name}</span>
          </>
        );
      },
    },
    {
      title: <span className="font-bold">Phone No.</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.mobile}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Status</span>,

      editable: true,
      render: (_, record) => {
        return (
          <>
            <Tag
              className="font-bold text-sm"
              color={
                record.role === "admin"
                  ? "blue"
                  : record.role === "manager"
                  ? "green"
                  : "blue"
              }
            >
              {record.status}
            </Tag>
          </>
        );
      },
    },

    {
      title: <span className="font-bold">Source</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.source}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Location</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.address}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Course</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.course}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Assigned to</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.assigned_to}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">assigned Info</span>,
      render: (_, record) => {
        return (
          <>
            {record.assigned_info.map((item, assigned_seq) => (
              <div className="flex">
                <span key={assigned_seq} className="font-bold mr-2">
                  {" "}
                  {item.to}
                </span>
                <div>
                  <span key={assigned_seq} className="font-bold mr-2">
                    {" "}
                    {item.assigned_seq}
                  </span>
                </div>
              </div>
            ))}
          </>
        );
      },
      width: "10%",
      editable: true,
    },
    {
      title: <span className="font-bold">Date</span>,
      render: (_, record) => {
        return (
          <>
            <span className="font-bold mr-2">{record.date}</span>
          </>
        );
      },
      width: "10%",
      editable: true,
    },

    {
      title: <span className="font-bold">View</span>,
      render: (_, record) => {
        return (
          <>
            <Link className="font-bold mr-2">View Profile</Link>
          </>
        );
      },
      width: "10%",
      editable: true,
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  ///////////////handle filter toggle /////////////
  const handlefilterToggle = () => {
    setOpenRegForm(false);
    setOpenFilter(!OpenFilter);
  };
  ///////////////handle Registration Toggle /////////////
  const handleRegToggle = () => {
    setOpenRegForm(!OpenRegForm);
    setOpenFilter(false);
  };

  ///////////////Options///////////////////
  const role_options = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "executive", label: "Executive" },
  ];
  const gender_options = [
    { value: "male", label: "Male" },
    { value: "memale", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const options = Users.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));
  const name_options = Leads.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const source_options = NewSourceData.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const course_options = NewCourse.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const phone_options = Leads.map((item) => ({
    value: item.mobile,
    label: item.mobile,
  }));
  let status_options = NewStatus.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  status_options = [{ value: "fresh", label: "fresh" }, ...status_options];
  const uniqueAddress = [...new Set(Leads.map((item) => item.address))];
  const address_options = uniqueAddress.map((item) => ({
    value: item,
    label: item,
  }));

  let filtername = FormData.name.map((item) => {
    return item.value;
  });
  let filterRole = FormData.role.map((item) => {
    return item.value;
  });
  let filtercourse = FormData.course.map((item) => {
    return item.value;
  });
  let filtersource = FormData.source.map((item) => {
    return item.value;
  });
  let filterstatus = FormData.status.map((item) => {
    return item.value;
  });
  let filterPhone = FormData.mobile.map((item) => {
    return item.value;
  });
  let filterassigned_under = FormData.assigned_under.map((item) => {
    return item.value;
  });
  let filterassigned_to = FormData.assigned_to.map((item) => {
    return item.value;
  });
  let filteraddress = FormData.address.map((item) => {
    return item.value;
  });
  let filtergender = FormData.gender.map((item) => {
    return item.value;
  });
  function convertArrayValuesToLowercase(arr) {
    const lowercaseArr = arr.map((obj) => {
      const lowercaseObj = Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = typeof value === "string" ? value.toLowerCase() : value;
        return acc;
      }, {});
      return lowercaseObj;
    });

    return lowercaseArr;
  }

  const handleFilter = () => {
    const lowercaseArray = convertArrayValuesToLowercase(filterLeads());
    setTableData(lowercaseArray);
  };
  const handleReset = () => {
    setTableData(Users);
    const newData = {
      name: [],
      gender: [],
      status: [],
      mobile: [],
      source: [],
      dob: "",
      role: [],
      course: [],
      date: [],
      assigned_under: [],
      assigned_to: [],
      address: [],
    };
    setcreate_date_object([]);
    setFormData(newData);
  };

  const rep = (Users) => {
    setassignedMembers(Users);
    const updatedMembers = Users.map((record) => {
      const assignedById = record.assigned_to;
      const assignedUser = Users.find((item) => item._id === assignedById);

      if (assignedUser) {
        record.assigned_to = assignedUser.name;
      }

      return record;
    });
    setTableData(updatedMembers);
    return updatedMembers;
  };
  const filterLeads = () => {
    return LeadsData.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.name)) &&
        (!filtersource.length > 0 || filtersource.includes(item.source)) &&
        (!filterPhone.length > 0 || filterPhone.includes(item.mobile)) &&
        (!filterstatus.length > 0 || filterstatus.includes(item.status)) &&
        (!filterassigned_to.length > 0 ||
          filterassigned_to.includes(item.assigned_to)) &&
        (!filterstatus.length > 0 || filterstatus.includes(item.status)) &&
        (!filtercourse.length > 0 || filtercourse.includes(item.course)) &&
        (!filteraddress.length > 0 || filteraddress.includes(item.address)) &&
        (!filtergender.length > 0 || filtergender.includes(item.gender)) &&
        (!FormData.dob > 0 || FormData.dob === item.dob) &&
        (!create_date_object ||
          dayjs(item.date, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date[0], "DD-MM-YYYY"),
            dayjs(FormData.date[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const rangePresets = [
    {
      label: "This Week",
      value: [dayjs().day(0), dayjs()],
    },
    {
      label: "Last Week",
      value: [dayjs().day(0).add(-1, "w"), dayjs().day(-1)],
    },
    {
      label: "This Month",
      value: [dayjs().date(1), dayjs()],
    },
    {
      label: "Last Month",
      value: [dayjs().date(1).add(-1, "M"), dayjs().date(0)],
    },
  ];
  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded  shadow-lg m-4 ">
        <div className=" flex flex-row justify-between px-6 py-4">
          <div className="font-bold text-xl mb-2">{Path}</div>
          <div>
            <button
              onClick={handlefilterToggle}
              className="bg-Primary w-20 hover:opacity-50 text-sm  text-white font-bold  mr-2 py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
            >
              {OpenFilter ? <span>X</span> : <span>Filter</span>}
            </button>

            <button
              onClick={handleReset}
              className="bg-Primary hover:opacity-50 text-sm  text-white font-bold  py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
            >
              Reset
            </button>
            {/* <button
              onClick={() => {
                console.log(rep());
              }}
              className="bg-Primary hover:opacity-50 text-sm  text-white font-bold  py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
            >
              click
            </button> */}
          </div>
        </div>
        {OpenFilter && (
          <div className={`bg-white flex flex-col p-2 mb-5 w-full `}>
            <div className="font-bold text-xl m-2 ">
              <span>Member Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-start flex-grow ">
                {/* /////////////NAME */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Name:</label>
                  <Select
                    onChange={handleFullName}
                    value={FormData.name}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={name_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Phone No. */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Phone No:</label>
                  <Select
                    onChange={handlePhoneNo}
                    value={FormData.mobile}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={phone_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* course*/}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Course:</label>
                  <Select
                    onChange={handleCourse}
                    value={FormData.course}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={course_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-start flex-grow">
                {/* status */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">status:</label>
                  <Select
                    onChange={handleStatus}
                    value={FormData.status}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={status_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Source */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Source :</label>
                  <Select
                    onChange={handleFathersName}
                    value={FormData.source}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={source_options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Address */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Address:</label>
                  <Select
                    onChange={handleAddress}
                    value={FormData.address}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={address_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-start flex-grow">
                {/* /////////////Assigned to */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Assigned To:
                  </label>
                  <Select
                    onChange={handleAssignedBy}
                    value={FormData.assigned_to}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: state.isFocused ? "none" : "none",
                        backgroundColor: "transparent",
                        height: "100%",
                      }),
                    }}
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none "
                    isMulti
                    name="colors"
                    options={options}
                    classNamePrefix="select"
                  />
                </div>
                {/* Date Created/// */}
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label htmlFor="date" className="text-white font-bold p-1">
                    Date Created:
                  </label>

                  <RangePicker
                    value={create_date_object}
                    presets={rangePresets}
                    format="DD-MM-YYYY"
                    className="rounded-r-md pr-3  text-2xl bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleDateCreated}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <div>
                <button
                  onClick={handleFilter}
                  className=" flex  flex-row justify-center bg-Primary w-24  hover:opacity-80 text-xl  text-white  mr-2 p-2  hover:border-Primary hover:border-opacity-80 rounded"
                >
                  <span>
                    <FaCheck />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  ////////////handle Row Selection/////////////////////////
  const handleSelectionTypeChange = (e) => {
    setSelectionType(e.target.value);
  };

  const handleInputChange = (e) => {
    if (e.target.value > 0) {
      setNumberOfRows(parseInt(e.target.value, 10));
    } else {
      let selectedData = [];

      const keys = selectedData.map((item) => item.key);
      setSelectedRowsKey(keys);

      setNumberOfRows(0);
    }
  };
  const handleTaskType = (e) => {
    const task = e.target.value;
    setTaskType(task);
  };
  const handleButtonClick = () => {
    if (numberOfRows && numberOfRows <= TableData.length) {
      let selectedData = [];

      if (selectionType === "manual") {
        selectedData = selectedRows.map((row, index) => row);
      } else if (selectionType === "top") {
        selectedData = TableData.slice(0, numberOfRows).map(
          (row, index) => row
        );
      } else if (selectionType === "bottom") {
        selectedData = TableData.slice(-numberOfRows).map((row, index) => row);
      } else {
        selectedData = [];
      }
      setselectedData(selectedData);
      const keys = selectedData.map((item) => item.key);
      setSelectedRowsKey(keys);
      console.log("Selected Rows:", selectedData);
    } else if (numberOfRows && numberOfRows > TableData.length) {
      alert(`Only ${TableData.length} Data available`);
    } else {
      alert(`No Data Selected`);
    }
  };
  const handleDeselect = () => {
    let selectedData = [];

    const keys = selectedData.map((item) => item.key);
    setSelectedRowsKey(keys);
    setNumberOfRows(0);
    setSelectedRows([]);
  };
  const assign_leads = async () => {
    console.log("selectedData:", selectedData);
    const newArray = selectedData.map((obj) => {
      return {
        lead_id: obj._id,
        assign_date: dayjs().format("DD-MM-YYYY"),
      };
    });

    if (assign_to.length > 2 && selectedRowsKey.length > 0) {
      const newAssign = {
        member_id: assign_to[0],
        member_name: assign_to[1],
        leads: newArray,
      };
      try {
        setisTask(true);
        const response = await axios.post(
          "https://tgcrm-root-api.vercel.app/assign-leads",
          newAssign
        );

        if (response.data) {
          try {
            const leadResponse = await axios.post(
              "https://tgcrm-root-api.vercel.app/update-leads",
              newAssign
            );
            if (leadResponse) {
              setisTask(false);
              handleDeselect();
              setassign_to([]);
              success();
            }
            // Handle the leadResponse
            console.log(leadResponse.data);
            getLeads();
          } catch (error) {
            // Handle the error
            setassign_to([]);
            setisTask(false);
            errorMsg("error");
            console.error(error);
          }
        }

        // Handle the response
        console.log(response.data);
      } catch (error) {
        setassign_to([]);
        setisTask(false);
        // Handle the error
        errorMsg("error");
        console.error(error);
      }
    } else {
      setassign_to([]);
      errorMsg("  Leads or Member Not Selected !");
    }
  };
  /////////delete///
  const handleDelete = async () => {
    console.log("selectedData:", selectedData);
    const response = await fetch(
      `https://tcrm-pi-tagoregroupofintitutions.vercel.app/deleteLeads`,
      {
        method: "POST",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      console.log(response);
    });
  };
  let TaskButton;
  if (isTask === false) {
    TaskButton =
      TaskType === "assign" ? (
        <button
          type="submit"
          className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded" // disabled={!isFormValid()}
          onClick={assign_leads}
        >
          Assign
        </button>
      ) : (
        <button
          type="submit"
          className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded" // disabled={!isFormValid()}
          // onClick={handleSubmit}
        >
          Delete<i className="fa-solid fa-house"></i>
        </button>
      );
  } else {
    TaskButton = (
      <button
        disabled
        className="flex justify-center items-center bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary opacity-50 rounded"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Assign...
      </button>
    );
  }

  return (
    <div className="w-12/12 ">
      {contextHolder}
      <FilterTab />
      {/* Action Comp */}
      <div className="w-12/12  bg-gray-200 rounded  shadow-lg m-4 ">
        <div className=" flex flex-col justify-between ">
          <div className="flex justify-between font-bold text-xl mb-2 px-6 py-4">
            <div>Action</div>
            <div className="mr-4">Total Selected: {selectedRowsKey.length}</div>
          </div>
          <div className="flex justify-between items-center bg-white px-6 py-4 ">
            <div
              className={`flex items-center  box-border w-full  font-bold pl-1 focus:outline-none`}
            >
              <div className="flex items-center gap-2 box-border w-full bg-white  font-bold pl-1 focus:outline-none">
                <input
                  id="top"
                  type="radio"
                  name="selectionType"
                  value="top"
                  checked={selectionType === "top"}
                  onChange={handleSelectionTypeChange}
                />
                <label htmlFor="top"> Top</label>
                <input
                  id="bottom"
                  type="radio"
                  name="selectionType"
                  value="bottom"
                  checked={selectionType === "bottom"}
                  onChange={handleSelectionTypeChange}
                />
                <label htmlFor="bottom"> Bottom</label>

                <input
                  id="manual"
                  type="radio"
                  name="selectionType"
                  value="manual"
                  checked={selectionType === "manual"}
                  onChange={handleSelectionTypeChange}
                />
                <label htmlFor="manual"> Manual</label>
                <input
                  className={` bg-slate-200 box-border h-8 border-r-8 p1 w-40  font-bold pl-1 focus:outline-none ${
                    selectionType === "manual" && "opacity-0"
                  }`}
                  type="number"
                  placeholder="Number of rows"
                  value={numberOfRows ? numberOfRows : ""}
                  disabled={selectionType === "manual"}
                  onChange={handleInputChange}
                />

                <button
                  type="button"
                  className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
                  onClick={handleButtonClick}
                >
                  Select Leads
                </button>
                <button
                  type="button"
                  className=" bg-Primary hover:opacity-50 text-lg h-auto  text-white  px-2  border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
                  onClick={handleDeselect}
                >
                  X
                </button>
              </div>

              {/* task Options */}
              <div className="flex justify-end gap-10 items-center w-full   pl-10 ml-10">
                <div className="flex items-center gap-2 box-border w-full bg-white  font-bold pl-1 focus:outline-none">
                  <label className=" flex mr-2 font-bold">Select Task:</label>
                  <select
                    className={` bg-slate-200 p1 border-r-8 h-8  font-bold pl-1 focus:outline-none`}
                    name="role"
                    onChange={handleTaskType}
                  >
                    <option value="">Select Task</option>
                    <option value="delete">Delete</option>
                    <option value="assign">Assign</option>

                    {/* Add more options as needed */}
                  </select>
                </div>

                <div
                  className={`flex items-center gap-2 box-border w-full bg-white  font-bold pl-1 focus:outline-none ${
                    TaskType === "assign" ? "" : "invisible"
                  }`}
                >
                  <label className=" flex mr-2 font-bold">Assign To:</label>
                  <select
                    value={assign_to.length < 2 ? "" : assign_to[2]}
                    className={` bg-slate-200 p1 border-r-8 h-8  font-bold pl-1 focus:outline-none`}
                    name="assigned_to"
                    onChange={(e) => {
                      const details = e.target.value.split("-");
                      const newarr = [...details, e.target.value];
                      setassign_to(newarr);
                      console.log("ID:", details[0], " name:", details[1]);
                    }}
                  >
                    <option value="">Select </option>
                    {Users.map((record) => (
                      <option value={`${record._id}-${record.full_name}`}>
                        {record.full_name}
                      </option>
                    ))}

                    {/* Add more options as needed */}
                  </select>
                </div>

                {TaskButton}
              </div>
            </div>
            {/* Select Button...... */}
          </div>
        </div>
      </div>
      {/*  */}
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2 ">
        <div className="flex justify-between items-center p-4">
          <div className="font-bold text-lg mb-2">
            Total: {TableData.length}
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={TableData}
            rowSelection={{
              selectedRowKeys: selectedRowsKey,

              onChange: (selectedRowKeys, record) => {
                setSelectedRows(record);
                setSelectedRowsKey(selectedRowKeys);
                setNumberOfRows(selectedRowKeys.length);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default LeadsList;
