import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { DatePicker } from "antd";
import Select from "react-select";

import { useLocation } from "react-router-dom";

import { FaCheck } from "react-icons/fa";

import { TGCRMContext } from "../../../../Context/Context";
import dayjs from "dayjs";
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
const StatusList = () => {
  const location = useLocation();

  // Access the current pathname, search, and hash
  const { pathname } = location;
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [Path, setPath] = useState("");
  const [OpenFilter, setOpenFilter] = useState(false);
  const [OpenRegForm, setOpenRegForm] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [FormData, setFormData] = useState({
    name: [],
    color_code: [],

    created_by: [],

    date_created: [],

    status_fee: [],
  }); // eslint-disable-next-line
  const { getMember, memberData, StatusData, getStatus } =
    useContext(TGCRMContext);
  const [create_date_object, setcreate_date_object] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [status, setStatus] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
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
    get_location(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const data = memberData.filter((item) => {
      return item.role === "admin";
    });
    console.log("Admins", data);
    setAdminUsers(data);
  }, [getMember]);

  useEffect(() => {
    setStatus(StatusData);
    setTableData(StatusData);
  }, [getStatus]);

  const handleStatusName = (value) => {
    const newData = { ...FormData };
    newData.name = value;
    setFormData(newData);
  };

  const handle = (value) => {
    const newData = { ...FormData };
    newData.color_code = value;
    setFormData(newData);
  };

  const handleDateCreated = (date, dateString) => {
    console.log("date Created", dateString);
    const newData = { ...FormData };
    newData.date_created = dateString;
    setFormData(newData);
    setcreate_date_object(date);
    console.log("date Created", dateString);
  };
  const handleCreatedBy = (value) => {
    const newData = { ...FormData };
    newData.created_by = value;
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
      title: "name",
      width: "25%",
      editable: true,
      render: (_, record) => {
        return <Tag color={record.color_code}>{record.name}</Tag>;
      },
    },
    {
      title: "Code",
      dataIndex: "color_code",
      width: "15%",
      editable: true,
    },
    {
      title: "Admin Count",
      dataIndex: "admin_count",
      width: "15%",
      editable: true,
    },
    {
      title: "Followup Count",
      dataIndex: "followup_count",
      width: "15%",
      editable: true,
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      width: "20%",
      editable: true,
    },
    {
      title: "Created Date",
      dataIndex: "date_created",
      width: "15%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a href="/#">Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
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
  /////////////////////Member Registration Form////////////////////////////////
  const RegForm = () => {
    return <statusRegForm />;
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
  const created_by_options = adminUsers.map((item) => ({
    value: item.full_name,
    label: item.full_name,
  }));
  const status_name_options = StatusData.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  const code_options = StatusData.map((item) => ({
    value: item.color_code,
    label: item.color_code,
  }));
  let filtername = FormData.name.map((item) => {
    return item.value;
  });
  let filtercolor_code = FormData.color_code.map((item) => {
    return item.value;
  });
  let filtercreated_by = FormData.created_by.map((item) => {
    return item.value;
  });
  const handleFilter = () => {
    setTableData(filterMembers());
  };
  const handleReset = () => {
    setTableData(StatusData);
    const newData = {
      name: [],
      color_code: [],

      created_by: [],

      date_created: [],

      status_fee: [],
    };
    setcreate_date_object([]);
    setFormData(newData);
  };
  const filterMembers = () => {
    return status.filter(
      (item) =>
        (!filtername.length > 0 || filtername.includes(item.name)) &&
        (!filtercolor_code.length > 0 ||
          filtercolor_code.includes(item.color_code)) &&
        (!filtercreated_by.length > 0 ||
          filtercreated_by.includes(item.created_by)) &&
        (!create_date_object ||
          dayjs(item.date_created, "DD-MM-YYYY").isBetween(
            dayjs(FormData.date_created[0], "DD-MM-YYYY"),
            dayjs(FormData.date_created[1], "DD-MM-YYYY"),
            "DD-MM-YYYY",
            "[]"
          ))
    );
  };
  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded shadow-lg m-4">
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
          </div>
        </div>
        {OpenFilter && (
          <div className={`bg-white flex flex-col p-2 mb-5 w-full `}>
            <div className="font-bold text-xl m-2 ">
              <span>Status Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
                    Status Name:
                  </label>
                  <Select
                    onChange={handleStatusName}
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
                    options={status_name_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>

              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
                    Created By:
                  </label>
                  <Select
                    onChange={handleCreatedBy}
                    value={FormData.created_by}
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
                    options={created_by_options}
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex  flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white pl-2 font-bold p-1">
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
  return (
    <div className="w-12/12 ">
      <FilterTab />
      <div className="w-12/12 bg-gray-200 rounded overflow-hidden shadow-lg m-4 p-2">
        <div className="flex justify-between items-center p-4">
          <div className="font-bold text-lg mb-2">
            Total: {TableData.length}
          </div>
          {/* <button
            onClick={handleRegToggle}
            className="flex justify-center w-20 bg-Primary hover:opacity-50 text-xl  text-white  p-1 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
          >
            {OpenRegForm ? <span>X</span> : <span>Add</span>}
          </button> */}
        </div>

        {/* {OpenRegForm && (
          <div
            className={`  duration-1000 ${
              OpenRegForm ? "opacity-100" : "opacity-0"
            }  `}
          >
            <RegForm />
          </div>
        )} */}
        <div>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={TableData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
export default StatusList;
