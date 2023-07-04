import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
// import RegistrationForm from "../../../Froms/RegistrationForm/RegistrationForm";
import { useLocation } from "react-router-dom";
import RegistrationForm from "../../../Froms/RegistrationForm/RegistrationForm";
import { FaCheck } from "react-icons/fa";
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
const MemberAnalytics = () => {
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
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone_no: "",
    fathers_name: "",
    dob: "",
    role: "",
    branch_position: "",
    date_created: "",
    assigned_under: "",
    assigned_by: "",
    address: "",
    password: "",
  }); // eslint-disable-next-line
  const handleFirstName = (e) => {
    const newData = { ...FormData };
    newData.first_name = e.target.value;
    setFormData(newData);
  };

  const handleLastName = (e) => {
    const newData = { ...FormData };
    newData.last_name = e.target.value;
    setFormData(newData);
  };

  const handleGender = (e) => {
    const newData = { ...FormData };
    newData.gender = e.target.value;
    setFormData(newData);
  };

  const handleEmail = (e) => {
    const newData = { ...FormData };
    newData.email = e.target.value;
    setFormData(newData);
  };

  const handlePhoneNo = (e) => {
    const newData = { ...FormData };
    newData.phone_no = e.target.value;
    setFormData(newData);
  };

  const handleFathersName = (e) => {
    const newData = { ...FormData };
    newData.fathers_name = e.target.value;
    setFormData(newData);
  };

  const handleDOB = (e) => {
    const newData = { ...FormData };
    newData.dob = e.target.value;
    setFormData(newData);
  };

  const handleRole = (e) => {
    const newData = { ...FormData };
    newData.role = e.target.value;
    setFormData(newData);
  };

  const handleBranchPosition = (e) => {
    const newData = { ...FormData };
    newData.branch_position = e.target.value;
    setFormData(newData);
  };

  const handleDateCreated = (e) => {
    const newData = { ...FormData };
    newData.date_created = e.target.value;
    setFormData(newData);
  };

  const handleAssignedUnder = (e) => {
    const newData = { ...FormData };
    newData.assigned_under = e.target.value;
    setFormData(newData);
  };

  const handleAssignedBy = (e) => {
    const newData = { ...FormData };
    newData.assigned_by = e.target.value;
    setFormData(newData);
  };

  const handleAddress = (e) => {
    const newData = { ...FormData };
    newData.address = e.target.value;
    setFormData(newData);
  };

  const handlePassword = (e) => {
    const newData = { ...FormData };
    newData.password = e.target.value;
    setFormData(newData);
  };
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
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
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
    return <RegistrationForm />;
  };

  const FilterTab = () => {
    return (
      <div className="w-12/12  bg-gray-200 rounded overflow-hidden shadow-lg m-4">
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
              onClick={() => {
                setOpenFilter(!OpenFilter);
              }}
              className="bg-Primary hover:opacity-50 text-sm  text-white font-bold  py-2 px-4 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
            >
              Reset
            </button>
          </div>
        </div>
        {OpenFilter && (
          <div className={`bg-white flex flex-col p-2 mb-5 w-full `}>
            <div className="font-bold text-xl m-2 ">
              <span>Member Filter :</span>
            </div>

            <div className="flex flex-row justify-between mb-2 w-full flex-wrap">
              <div className="  flex flex-col justify-between flex-grow ">
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Role:</label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleRole}
                    value={FormData.role}
                    name="role"
                    type="text"
                  />
                </div>
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Branch Position:
                  </label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleBranchPosition}
                    value={FormData.branch_position}
                    name="branch_position"
                    type="text"
                  />
                </div>

                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Assigned Under:
                  </label>
                  <select
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleAssignedUnder}
                    value={FormData.assigned_under}
                    name="assigned_under"
                  >
                    <option value="">Select Option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label htmlFor="dob" className="text-white font-bold p-1">
                    Date Created:
                  </label>

                  <DatePicker className="rounded-r-md pr-3  text-2xl bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none" />
                </div>
              </div>
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    First Name:
                  </label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleFirstName}
                    value={FormData.first_name}
                    name="first_name"
                    type="text"
                  />
                </div>

                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Last Name:</label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleLastName}
                    value={FormData.last_name}
                    name="last_name"
                    type="text"
                  />
                </div>

                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Assigned By:
                  </label>
                  <select
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleAssignedBy}
                    value={FormData.assigned_by}
                    name="assigned_by"
                  >
                    <option value="">Select Option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label htmlFor="dob" className="text-white font-bold p-1">
                    Date of Birth:
                  </label>

                  <DatePicker className="rounded-r-md pr-3  text-2xl bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none" />
                </div>
              </div>
              <div className="  flex flex-col justify-between flex-grow">
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">
                    Father's Name:
                  </label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleFathersName}
                    value={FormData.fathers_name}
                    name="fathers_name"
                    type="text"
                  />
                </div>
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Address:</label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleAddress}
                    value={FormData.address}
                    name="address"
                    type="text"
                  />
                </div>
                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Phone No:</label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handlePhoneNo}
                    value={FormData.phone_no}
                    name="phone_no"
                    type="text"
                  />
                </div>

                <div className="flex flex-row justify-between m-2 bg-slate-600 rounded-md">
                  <label className="text-white font-bold p-1">Email:</label>
                  <input
                    className="rounded-r-md bg-slate-200 p1 w-7/12 font-bold pl-1 focus:outline-none"
                    onChange={handleEmail}
                    value={FormData.email}
                    name="email"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <div>
                <button
                  onClick={() => {
                    console.log(FormData);
                  }}
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
          <div className="font-bold text-lg mb-2">Total: 20</div>
          <button
            onClick={handleRegToggle}
            className="flex justify-center w-20 bg-Primary hover:opacity-50 text-xl  text-white  p-1 border-b-4 border-yellow-800 hover:border-Primary hover:border-opacity-25 rounded"
          >
            {OpenRegForm ? <span>X</span> : <span>Add</span>}
          </button>
        </div>

        {OpenRegForm && (
          <div
            className={`  duration-1000 ${
              OpenRegForm ? "opacity-100" : "opacity-0"
            }  `}
          >
            <RegForm />
          </div>
        )}
        <div>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
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
export default MemberAnalytics;
