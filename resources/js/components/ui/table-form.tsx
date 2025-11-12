const TableForm = ({thead ,tbody}:any) => {



  return (
    <table className="w-full table-auto border-collapse">
      <thead className="bg-muted">
        <tr>
          {thead.map((item:any,idx:any)=><th key={idx}>{item}</th>)}
        </tr>
      </thead>
        <tbody>
            {tbody.map((row:any, rowIndex:any) => (
                <tr key={rowIndex}>
                    {row.map((cell:any, cellIndex:any) => (
                        <td key={cellIndex} className="border px-4 py-2">{cell}</td>
                    ))}
                </tr>
            ))}1
        </tbody>
    </table>
  );
}

export default TableForm;