import { CURRENT_USER } from "constants/auth.constant";

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.onerror = (error) => {
      reject(error);
    }
  })
}

const options = (array: any) => {
  return array?.length > 0 && array?.map((item: any) => {
    let o: any = {};
    o.value = item?.id;
    o.label = item?.name;
    return o;
  })
}

const getDataExcel = (data: any, objectKey: any, fields: any) => {
  return data
    ?.map((item: any) => {
      let newItem: any = {};
      objectKey?.forEach((x: any) => {
        fields?.forEach((y: any) => {
          if (x === y.key) {
            newItem[x] = item[x];
          }
        })
      });
      return newItem;
    })
    ?.map((z: any) => {
      return fields?.map((item: any) => {
        return z[item.key]
      })
    })
}

const getFields = (columnTable: any) => {
  return columnTable
  ?.filter((x: any) => x?.show && x?.key !== "action")
  ?.map((y: any) => ({ key: y.key, title: y.title, width: y.widthExcel }));
}

const addRow = (ws: any, data: any, section: any) => {
  const borderStyles = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  const row = ws.addRow(data);
  row.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
    if (section?.border) {
      cell.border = borderStyles;
    }
    if (section?.alignment) {
      cell.alignment = section.alignment;
    } else {
      cell.alignment = { vertical: 'middle' };
    }
    if (section?.font) {
      cell.font = section.font;
    }
    if (section?.fill) {
      cell.fill = section.fill;
    }
  });
  if (section?.height > 0) {
    row.height = section.height;
  }
  return row;
};

const mergeCells = (ws: any, row: any, from: any, to: any) => {
  ws.mergeCells(
    `${row.getCell(from)._address}:${row.getCell(to)._address}`
  );
};

const onChangeCheckbox = (item: any, e: any, columnTable: any, setColumnTable: any) => {
  let newColumns: any = columnTable.map((column: any) => {
    if (item.title === column.title) {
      column.show = e.target.checked;
    };
    return column;
  });
  setColumnTable(newColumns);
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER) || '');
}

export {
  convertBase64,
  options,
  getDataExcel,
  getFields,
  addRow,
  mergeCells,
  onChangeCheckbox,
  getCurrentUser
}