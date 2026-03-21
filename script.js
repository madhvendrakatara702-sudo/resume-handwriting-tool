function showPage(page){
document.getElementById("home").style.display="none";
document.querySelectorAll(".pageSection").forEach(p=>p.style.display="none");
if(page==="home"){
document.getElementById("home").style.display="block";
}else{
document.getElementById(page).style.display="block";
}
}
// MENU
function toggleMenu(){
let m=document.getElementById("menu");
m.style.display=m.style.display==="flex"?"none":"flex";
}
function toggleDark(){
document.body.classList.toggle("dark");
}

// TEXT → HANDWRITING
function convertText(){
let fontSize = parseInt(document.getElementById("fontSize").value);
let lineSpacing = parseInt(document.getElementById("lineSpacing").value);
let text=inputText.value;
pages.innerHTML="";
let page=document.createElement("div");
page.className="page "+pageType.value;
page.style.fontFamily=fontType.value;
page.innerText=text;
pages.appendChild(page);

}
// PDF
async function downloadPDF(){
const { jsPDF } = window.jspdf;
let pdf=new jsPDF();
let canvas=await html2canvas(document.querySelector(".page"));
let img=canvas.toDataURL();
pdf.addImage(img,'PNG',10,10,180,0);
pdf.save("file.pdf");
}

// IMAGE OCR
imgInput.addEventListener("change",function(e){
let file=e.target.files[0];
Tesseract.recognize(file,'eng').then(({data:{text}})=>{
inputText.value=text;
convertText();
});
});

// PDF READ
pdfInput.addEventListener("change",async function(e){
let file=e.target.files[0];
let reader=new FileReader();
reader.onload=async function(){
let pdf=await pdfjsLib.getDocument(new Uint8Array(this.result)).promise;
let text="";
for(let i=1;i<=pdf.numPages;i++){
let page=await pdf.getPage(i);
let content=await page.getTextContent();
content.items.forEach(i=>text+=i.str+" ");
}
inputText.value=text;
convertText();
};
reader.readAsArrayBuffer(file);
});

// RESUME
function openResume(){
menu.style.display="none";
resumeModal.style.display="flex";
}
function closeResume(){
resumeModal.style.display="none";
}
function generateResume() {
    resumeOutput.innerHTML = `

  <h3 class="section-title">Name</h3>
  <p style="color:${textColor.value}">
    ${nameInput.value}
  </p>

  <h3 class="section-title">Email</h3>
  <p style="color:${textColor.value}">
    ${email.value}
  </p>

  <h3 class="section-title">Phone no.</h3>
  <p style="color:${textColor.value}">
    ${phone.value}
  </p>

  <h3 class="section-title">Address</h3>
<p style="color:${textColor.value}">
${address.value}</p>

  <h3 class="section-title">Skills</h3>
  <p style="color:${textColor.value}">
    ${skills.value}
  </p>

  <h3 class="section-title">Education</h3>
  <p style="color:${textColor.value}">
    ${education.value}
  </p>

  <h3 class="section-title">Experience</h3>
  <p style="color:${textColor.value}">
    ${experience.value}
  </p>


 <h3 class="section-title">Project</h3>
<p style="color:${textColor.value}">
${projects.value}</p>
`;
}

async function downloadResume() {
  const { jsPDF } = window.jspdf;

  let pdf = new jsPDF("p", "mm", "a4");

  let content = document.getElementById("resumeOutput");

  let canvas = await html2canvas(content, {
    scale: 2
  });

  let imgData = canvas.toDataURL("image/png");

  let imgWidth = 210; // A4 width
  let pageHeight = 295; // A4 height

  let imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;

  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Extra pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("resume.pdf");
}

function sendMail(){

let params = {
name: document.getElementById("user_name").value,
email: document.getElementById("user_email").value,
message: document.getElementById("message").value
};

emailjs.send("service_2zy2fx7","template_z2f9snk",params)
.then(function(res){
alert("Message Sent Successfully ✅");
})
.catch(function(err){
alert("Failed ❌");
});

}
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const skills = document.getElementById("skills");
const education = document.getElementById("education");
const experience = document.getElementById("experience");
const projects = document.getElementById("projects");
const resumeOutput = document.getElementById("resumeOutput");
