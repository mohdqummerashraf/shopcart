import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, selectLoggedInUser } from "../AuthSlice";
import { useNavigate } from "react-router-dom";
import { clearLocalCart } from "../../../app/cardutils";

export const Logout = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    clearLocalCart();
    dispatch(logoutAsync());
  }, []);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
      navigate(0);
    }
  }, [loggedInUser]);

  return <></>;
};
