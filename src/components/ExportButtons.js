export default function ExportButtons(){

const exportExcel = () => {

window.open(
"http://localhost:8080/ABM/api/finance/exportfinance.php",
"_blank"
);

};

return(

<div>

<button onClick={exportExcel}>
Export Financial Reports (Excel)
</button>

</div>

);

}