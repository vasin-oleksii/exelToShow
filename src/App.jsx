import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchExcelFile = async () => {
      try {
        const response = await fetch("/price.xlsx"); // Загружаем файл из public/
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0]; // Берем первую страницу
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        if (sheet.length > 0) {
          setColumns(sheet[0]); // Заголовки таблицы
          setData(sheet.slice(1)); // Данные
        }
      } catch (error) {
        console.error("Ошибка загрузки Excel файла:", error);
      }
    };

    fetchExcelFile();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Excel Viewer</h1>

      {data.length > 0 && (
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "8px",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{ padding: "8px", border: "1px solid #ddd" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
