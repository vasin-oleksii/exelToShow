import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchExcelFile = async () => {
      try {
        const response = await fetch("/price.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        if (sheet.length > 0) {
          setColumns(sheet[0]);
          setData(sheet.slice(1));
        }
      } catch (error) {
        console.error("Помилка завантаження Excel файлу:", error);
      }
    };

    fetchExcelFile();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.some((cell) =>
        cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const requestSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <div className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => window.history.back()}
          className="back-button"
          style={{ fontSize: "20px", padding: "15px 30px" }}
        >
          ⬅ Повернутися назад
        </button>
        <img
          src="https://optim.tildacdn.one/tild6336-6365-4434-a262-313632656537/-/resize/480x/-/format/webp/3910x2910-4.jpg"
          alt="Sensus Фото"
          className="sensus-image"
          onClick={() => window.history.back()}
        />
      </div>
      <h1>Sensus.zp.ua - Цiни</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Пошук..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="table-header"
                  onClick={() => requestSort(index)}
                >
                  {col}
                  {sortConfig.key === index ? (
                    sortConfig.direction === "asc" ? (
                      <span className="sort-icon">↑</span>
                    ) : (
                      <span className="sort-icon">↓</span>
                    )
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="table-cell">
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
