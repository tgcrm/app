import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const TGCRMContext = createContext();

export const Context = ({ children }) => {
  //////////////user States/////////
  const [userToken, setuserToken] = useState(null);
  const [AuthUser, setAuthUser] = useState({});
  const [LoginMessage, setLoginMessage] = useState(
    "Login with Email and Password"
  );
  const [islogin, setislogin] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [CourseData, setCourseData] = useState([]);
  const [StatusData, setStatusData] = useState([]);
  const [SourcesData, setSourcesData] = useState([]);
  const [LeadsData, setLeadsData] = useState([]);
  const [PerformanceData, setPerformanceData] = useState([]);
  useEffect(() => {
    getMember();
    getCourse();
    getStatus();
    getSource();
    getLeads();
    getPerformance();
  }, []);
  //////Fetch Member///
  const getMember = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/member"
      );
      console.log("Members from Context", response.data);
      setMemberData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  ///////////////Login///////////////
  const login = async ({ email, password }) => {
    try {
      setislogin(true);
      const response = await fetch("https://tgcrm-root-api.vercel.app/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token, memberData } = await response.json();
      console.log(
        "Token From Context",
        token,
        "member Data from Context",
        memberData
      );
      // const data = await response.json();
      console.log("data", token);
      if (!token) {
        setuserToken(null);
        setislogin(false);
        setLoginMessage("Email Or Password is Incorrect");
        window.localStorage.removeItem("token_id");
        setAuthUser({});
      } else {
        // Handle the response token

        window.localStorage.setItem("token_id", token);
        setisAuthenticated(true);
        setAuthUser(memberData);
        setuserToken(token);
        setislogin(false);
        setLoginMessage("Login Successfull");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  ////////////Logout////////////////////
  const logout = () => {
    window.localStorage.removeItem("token_id");
  };

  //////Fetch Member///
  const getCourse = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/course"
      );
      console.log("Courses from Context", response.data);
      setCourseData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //////Fetch Status///
  const getStatus = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/status"
      );
      console.log("statuss from Context", response.data);
      setStatusData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //////Fetch Source///
  const getSource = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/source"
      );
      console.log("statuss from Context", response.data);
      setSourcesData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //////Fetch Source///
  const getLeads = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/leads"
      );
      console.log("Leads from Context", response.data);
      setLeadsData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //////Fetch Status///
  const getPerformance = async () => {
    try {
      const response = await axios.get(
        "https://tgcrm-root-api.vercel.app/performance"
      );
      console.log("statuss from Context", response.data);
      setPerformanceData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <TGCRMContext.Provider
      value={{
        login,
        logout,
        islogin,
        LoginMessage,
        isAuthenticated,
        AuthUser,
        setislogin,
        userToken,
        getMember,
        memberData,
        getCourse,
        CourseData,
        getStatus,
        StatusData,
        getSource,
        SourcesData,
        getLeads,
        LeadsData,
        getPerformance,
        PerformanceData,
      }}
    >
      {children}
    </TGCRMContext.Provider>
  );
};

export default Context;
