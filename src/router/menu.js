import User from "@/views/User";
import Department from "@/views/Department";
import Schedule from "@/views/Schedule";
import Appointment from "@/views/Appointment";

const menus = [
  {
    menuId: 2,
    path: '/User',
    name: '患者管理',
    icon: "el-icon-user",
    component: User,
    role: '管理员'
  },
  {
    menuId: 5,
    path: "/Department",
    name: "科室管理",
    component: Department,
    icon: "el-icon-menu",
    role: '管理员'
  },
  {
    menuId: 4,
    path: "/Schedule",
    name: "排班管理",
    component: Schedule,
    icon: "el-icon-date",
    role: '管理员'
  },
  {
    menuId: 9,
    path: "/Appointment",
    name: "预约记录",
    component: Appointment,
    icon: "el-icon-phone",
    role: '医生'
  },
]
export default {menus}
