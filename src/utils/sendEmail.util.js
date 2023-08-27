require("dotenv").config();
const nodemailer = require("nodemailer");
const err = require("../errors/index");
import { v4 as uuidv4 } from "uuid";

const smtpTrans = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports.sendActiveEmail = async (req, user) => {
  const activeToken = uuidv4();
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    to: user.email,
    from: "MDM",
    subject: "Kích hoạt tài khoản",
    text:
      "You are receiving this because you (or someone else) have requested active your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      domain +
      "/active/" +
      activeToken +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  const send = await smtpTrans.sendMail(mailOptions);

  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return activeToken;
};

module.exports.sendForgotEmail = async (req, user) => {
  const token = uuidv4();
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    to: user.email,
    from: "MDM",
    subject: "Reset mật khẩu",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      domain +
      "/reset_password/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  const send = await smtpTrans.sendMail(mailOptions);

  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return token;
};

module.exports.sendReportEquipmentMail = async (req, users, data) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    from: "MDM",
    subject: "Báo hỏng thiết bị",
    text:
      `Thiết bị ${data?.equipment} của ${data?.department} đã được báo hỏng.\n\n` +
      "Dưới đây là link mô tả chi tiết tình trạng hiện tại của thiết bị. Vui lòng click vào để xem chi tiết.\n\n" +
      domain +
      `/equipment/repair/create_schedule/${data?.equipment_id}`,
  };

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.sendHandoverEquipmentEmail = async (data, users) => {
  let mailOptions = {
    from: "MDM",
    subject: "Bàn giao thiết bị thành công",
  };
  if (data?.files) {
    mailOptions = {
      ...mailOptions,
      text:
        `Thiết bị ${data?.name} đã được bàn giao đến ${data.department} \n\n` +
        ` Ngày bàn giao: ${data?.handover_date} \n\n` +
        ` Cán bộ thực hiện: ${data?.handover_person_id}`,
      attachments: [
        {
          filename: "Biên bản bàn giao.docx",
          content: data?.files?.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };
  } else {
    mailOptions = {
      ...mailOptions,
      text:
        `Thiết bị ${data?.name} đã được bàn giao đến ${data.department} \n\n` +
        ` Ngày bàn giao: ${data?.handover_date} \n\n` +
        ` Cán bộ thực hiện: ${data?.handover_person_id}`,
    };
  }

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.reHandoverEmail = async (req, users, data) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    from: "MDM",
    subject: "Bàn giao thiết bị",
    text:
      `Thiết bị ${data?.equipment_name} thuộc ${data?.department_name} đã được bàn giao sau khi hoàn tất quá trình sửa chữa.\n\n` +
      "Các tài liệu trong quá trình báo hỏng và sửa chữa của thiết bị đã được gửi đính kèm. Vui lòng click vào để xem chi tiết.\n\n" +
      domain +
      `/equipment/repair/update_schedule/${data?.equipment_id}`,
    attachments: [
      {
        filename: "Phiếu báo hỏng.docx",
        content: data?.brokenFile?.split("base64,")[1],
        encoding: "base64",
      },
      {
        filename: "Phiếu yêu cầu sửa chữa.docx",
        content: data?.repairFile?.split("base64,")[1],
        encoding: "base64",
      },
    ],
  };
  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.sendLiquidationRequestEmail = async (req, data, users) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    from: "MDM",
    subject: "Yêu cầu thanh lý thiết bị",
    text:
      `Thiết bị ${data?.name} thuộc ${data?.department} đã được yêu cầu thanh lý.\n\n` +
      `Vui lòng click vào đường link dưới đây để xem chi tiết phiếu yêu cầu thanh lý.\n\n` +
      domain +
      `/equipment/liquidation_detail/${data?.equipment_id}`,
  };

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.sendLiquidationDoneEmail = async (req, data, users) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    from: "MDM",
    subject: "Thanh lý thiết bị",
    text:
      `Thiết bị ${data?.equipment_name} thuộc ${data?.department_name} đã được phê duyệt thanh lý.\n\n` +
      `Vui lòng click vào đường link dưới đây để xem chi tiết biên bản thanh lý.\n\n` +
      domain +
      `/equipment/liquidation_detail/${data?.equipment_id}`,
  };

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.sendTransferEmail = async (req, data, users) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);

  const mailOptions = {
    from: "MDM",
    subject: "Điều chuyển thiết bị",
    text:
      `Thiết bị ${data?.equipment_name} thuộc ${data?.from_department_name} đã được yêu cầu điều chuyển sang khoa phòng do bạn quản lý.\n\n` +
      `Vui lòng click vào đường link dưới đây để xem chi tiết biên bản điều chuyển.\n\n` +
      domain +
      `/equipment/transfer_detail/${data?.equipment_id}`,
  };

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};

module.exports.sendTransferApproveEmail = async (req, data) => {
  const domain = req?.headers?.origin;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);

  console.log("check email", data.email);
  const mailOptions = {
    from: "MDM",
    to: data.email,
    subject: "Phê duyệt điều chuyển thiết bị",
    text:
      `Thiết bị ${data?.equipment_name} thuộc ${data?.from_department} đã được phê duyệt yêu cầu điều chuyển sang ${data?.to_department}.\n\n` +
      `Vui lòng click vào đường link dưới đây để xem chi tiết biên bản điều chuyển.\n\n` +
      domain +
      `/equipment/transfer_detail/${data?.equipment_id}`,
  };

  const send = await smtpTrans.sendMail(mailOptions);
  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
};
