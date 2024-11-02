import React from "react";
import { Navbar } from "../features/navigation/components/Navbar";
import Userlist from "../features/user/components/Userlist";

export function Userlistpage() {
  return (
    <>
      <Navbar />
      <Userlist/>
    </>
  );
}
