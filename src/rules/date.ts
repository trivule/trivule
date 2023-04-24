import dayjs from "dayjs";
import { RuleCallBack } from "../contracts";
import { spliteParam, throwEmptyArgsException } from "../utils";

export const isDate: RuleCallBack = (input) => {
  return dayjs(input, undefined, true).isValid();
};

export const beforeDate: RuleCallBack = (input, date) => {
  return dayjs(input).isBefore(date);
};

export const afterDate: RuleCallBack = (input, date) => {
  return dayjs(input).isAfter(date);
};

export const dateBetween: RuleCallBack = (input, date) => {
  if (!date) {
    throwEmptyArgsException("dateBetween");
  }
  const [startDate, endDate] = spliteParam(date ?? "");
  return afterDate(input, startDate) && beforeDate(input, endDate);
};
