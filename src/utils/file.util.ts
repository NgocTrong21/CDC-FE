import {
  AlignmentType,
  Document,
  Paragraph,
  TextRun,
  TabStopType,
  Packer,
  LevelFormat
} from "docx";
import * as fs from 'file-saver';

const common_style: any = {
  numbering: {
    config: [
      {
        reference: "numbering",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
          },
        ],
      },
    ],
    
  },
  styles: {
    paragraphStyles: [
      {
        id: 'paragraph',
        run: {
          size: 28,
        },
        paragraph: {
          spacing: {
            line: 230,
            before: 200,
            after: 200
          }
        }
      }
    ]
  },
}

const common_text = (equipment: any, name: string) => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "\tSỞ Y TẾ \t\t\t",
          bold: true,
          size: 28
        }),
        new TextRun({
          text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
          bold: true,
          size: 24
        }),
      ],
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "BỆNH VIỆN IBME_MDM \t\t\t\t",
          bold: true,
          size: 24
        }),
        new TextRun({
          text: "Độc lập - Tự do - Hạnh phúc",
          bold: true,
          size: 24,
        }),
      ],
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
        {
          type: TabStopType.RIGHT,
          position: 2000,
        },
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: 28,
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
        after: 400
      }
    }),
    new Paragraph({
      text: `Tên thiết bị: ${equipment?.name}`,
      style: 'paragraph'
    }),
    new Paragraph({
      text: `Model: ${equipment?.model}`,
      style: 'paragraph'
    }),
    new Paragraph({
      text: `Serial: ${equipment?.serial}`,
      style: 'paragraph'
    }),
  ]
  
} 

export const downloadBrokenDocx = (equipment: any) => {
  const commonText = common_text(equipment, "PHIẾU BÁO HỎNG THIẾT BỊ Y TẾ")
  const doc = new Document({
    ...common_style,
    sections: [
      {
        children: [
          ...commonText,
          new Paragraph({
            text: `Khoa Phòng sử dụng: ${equipment?.department}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Mô tả sự cố, lí do hỏng của thiết bị: ${equipment?.reason}`,
            style: 'paragraph',
          }),
          new Paragraph({
            text: `Mức độ ưu tiên: ${equipment?.repair_priority}`,
            style: 'paragraph',
          }),
          new Paragraph({
            text: `Thời gian báo hỏng: ${equipment?.broken_report_date}`,
            style: 'paragraph',
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Cán bộ thực hiện",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.reporting_person_id}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
        ],
      },
    ],
  });
  Packer.toBlob(doc).then(blob => {
    fs.saveAs(blob, `Phiếu báo hỏng - ${equipment?.name} - ${new Date().toISOString().substring(0, 10)}.docx`);
  });
}

export const downloadHandoverDocx = (equipment: any) => {
  const commonText = common_text(equipment, "BIÊN BẢN BÀN GIAO THIẾT BỊ")
  const doc = new Document({
    ...common_style,
    sections: [
      {
        children: [
          ...commonText,
          new Paragraph({
            text: `Khoa Phòng bàn giao: ${equipment?.department}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Cán bộ phụ trách: ${equipment?.user_id}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Thời gian bàn giao: ${equipment?.handover_date}`,
            style: 'paragraph',
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Cán bộ thực hiện",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.handover_person_id}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
        ]
      }
    ]
  })
  Packer.toBlob(doc).then(blob => {
    fs.saveAs(blob, `Biên bản bàn giao thiết bị - ${equipment?.name} - ${new Date().toISOString().substring(0, 10)}.docx`);
  });
}

export const downloadRepairSchedule = (equipment: any) => {
  const commonText = common_text(equipment, "PHIẾU YÊU CẦU SỬA CHỮA THIẾT BỊ");
  const doc = new Document({
    ...common_style,
    sections: [
      {
        children: [
          ...commonText,
          
        ]
      }
    ]
  })
  Packer.toBlob(doc).then(blob => {
    fs.saveAs(blob, `Phiếu yêu cầu sửa chữa - ${equipment?.name} - ${new Date().toISOString().substring(0, 10)}.docx`);
  });
}

export const downloadLiquidationDocx = (equipment: any) => {
  const commonText = common_text(equipment, "BIÊN BẢN THANH LÝ THIẾT BỊ");
  const doc = new Document({
    ...common_style,
    sections: [
      {
        children: [
          ...commonText,
          new Paragraph({
            text: `Khoa Phòng sử dụng: ${equipment?.department}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Ngày tạo phiếu: ${equipment?.liquidation_date}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Lý do thanh lý: ${equipment?.reason}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Ghi chú: ${equipment?.note}`,
            style: 'paragraph'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Người thực hiện",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.create_user}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Người phê duyệt",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.approver}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
        ]
      }
    ]
  })
  Packer.toBlob(doc).then(blob => {
    fs.saveAs(blob, `Biên bản thanh lý thiết bị - ${equipment?.name} - ${new Date().toISOString().substring(0, 10)}.docx`);
  });
}

export const downloadTransferDocx = (equipment: any) => {
  const commonText = common_text(equipment, "BIÊN BẢN ĐIỀU CHUYỂN THIẾT BỊ");
  const doc = new Document({
    ...common_style,
    sections: [
      {
        children: [
          ...commonText,
          new Paragraph({
            text: `Khoa Phòng hiện tại: ${equipment?.from_department}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Khoa Phòng điều chuyển: ${equipment?.to_department}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Ngày tạo phiếu: ${equipment?.transfer_date}`,
            style: 'paragraph'
          }),
          new Paragraph({
            text: `Ghi chú: ${equipment?.note}`,
            style: 'paragraph'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Người thực hiện",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.transfer_create_user}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Người phê duyệt",
                bold: true
              }),
            ],
            style: 'paragraph',
            alignment: AlignmentType.RIGHT,
            spacing: {
              before: 1000
            }
          }),
          new Paragraph({
            text: `${equipment?.transfer_approver}`,
            style: 'paragraph',
            alignment: AlignmentType.RIGHT
          }),
        ]
      }
    ]
  })
  Packer.toBlob(doc).then(blob => {
    fs.saveAs(blob, `Biên bản điều chuyển thiết bị - ${equipment?.name} - ${new Date().toISOString().substring(0, 10)}.docx`);
  });
}

