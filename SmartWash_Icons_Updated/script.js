const screens = ["welcome","register","signin","google","home","forgot"];
let previousAuthScreen = "signin";
let currentUser = {name:"Sumathi Sankar",email:"sumathi.sankar@gmail.com"};
let toastTimer;

function showScreen(id){
  if(!screens.includes(id)) return;
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
function goBack(fallback){ showScreen(fallback || "welcome"); }
function showInfo(title,text){
  document.getElementById("dialogTitle").textContent=title;
  document.getElementById("dialogText").textContent=text;
  const dialog=document.getElementById("infoDialog");
  if(typeof dialog.showModal==="function") dialog.showModal(); else alert(title+"\\n\\n"+text);
}
function showToast(message){
  const el=document.getElementById("toast");
  el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800);
}
function togglePassword(id,button){
  const input=document.getElementById(id);
  input.type=input.type==="password"?"text":"password";
  button.textContent=input.type==="password"?"◉":"◎";
}
function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function setMessage(id,message,success=false){
  const el=document.getElementById(id);el.textContent=message;el.classList.toggle("success",success);
}

document.getElementById("registerPassword").addEventListener("input",e=>{
  const p=e.target.value;let score=0;
  if(p.length>=8)score++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))score++;
  if(/\d/.test(p))score++;if(/[^A-Za-z0-9]/.test(p))score++;
  const bar=document.getElementById("strengthBar");
  bar.style.width=(score*25)+"%";
  bar.style.background=score<2?"#e66b6b":score<4?"#e7b44c":"#20b5a5";
});

document.getElementById("registerForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("fullName").value.trim();
  const email=document.getElementById("registerEmail").value.trim().toLowerCase();
  const phone=document.getElementById("phone").value.trim();
  const password=document.getElementById("registerPassword").value;
  const confirm=document.getElementById("confirmPassword").value;
  if(!name||!email||!password){setMessage("registerMessage","Please fill in all required fields.");return}
  if(!validEmail(email)){setMessage("registerMessage","Enter a valid email address.");return}
  if(phone&&!/^[+0-9 ()-]{8,18}$/.test(phone)){setMessage("registerMessage","Enter a valid phone number.");return}
  if(password.length<8){setMessage("registerMessage","Password must contain at least 8 characters.");return}
  if(password!==confirm){setMessage("registerMessage","Passwords do not match.");return}
  if(!document.getElementById("terms").checked){setMessage("registerMessage","Please accept the Terms of Service and Privacy Policy.");return}
  const users=JSON.parse(localStorage.getItem("smartwash_users")||"{}");
  if(users[email]){setMessage("registerMessage","An account already exists for this email. Please sign in.");return}
  users[email]={name,email,phone,password};localStorage.setItem("smartwash_users",JSON.stringify(users));
  currentUser={name,email};setMessage("registerMessage","Account created successfully!",true);
  showToast("Welcome to SmartWash!");
  setTimeout(()=>openDashboard(),650);
});

document.getElementById("signinForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("signinEmail").value.trim().toLowerCase();
  const password=document.getElementById("signinPassword").value;
  if(!validEmail(email)||!password){setMessage("signinMessage","Enter a valid email and password.");return}
  const users=JSON.parse(localStorage.getItem("smartwash_users")||"{}");
  const user=users[email];
  // Demo credentials are accepted to make the prototype easy to test.
  if(user&&user.password!==password){setMessage("signinMessage","Incorrect password. Please try again.");return}
  if(user){currentUser={name:user.name,email:user.email}}
  else if(email==="demo@smartwash.com"&&password==="Laundry123"){currentUser={name:"Demo User",email}}
  else {setMessage("signinMessage","No account found. Register first, or use demo@smartwash.com / Laundry123.");return}
  if(document.getElementById("rememberMe").checked)localStorage.setItem("smartwash_last_email",email);
  setMessage("signinMessage","Signed in successfully!",true);openDashboard();
});

function openDashboard(){
  document.getElementById("helloName").textContent=(currentUser.name.split(" ")[0]||"USER").toUpperCase();
  document.querySelectorAll(".user-avatar").forEach(a=>a.textContent=(currentUser.name[0]||"S").toUpperCase());
  showScreen("home");
}
function googleFlow(from){
  previousAuthScreen=from==="register"?"register":"signin";
  showScreen("google");
}
function chooseGoogleAccount(name,email){
  // Simulates the account chooser; production needs Google OAuth.
  currentUser={name,email};
  showToast("Google sign-in simulated successfully");
  openDashboard();
}
function addGoogleAccount(){
  const email=prompt("Enter an email address for this demo sign-in:");
  if(!email)return;
  if(!validEmail(email)){showToast("Please enter a valid email address");return}
  currentUser={name:email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g,c=>c.toUpperCase()),email};
  openDashboard();
}
let resendSeconds=43;
let resendInterval=null;
document.getElementById("forgotForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("forgotEmail").value.trim();
  if(!validEmail(email)){setMessage("forgotMessage","Please enter a valid email address.");return}
  const users=JSON.parse(localStorage.getItem("smartwash_users")||"{}");
  // Demo verification code is shown in the page so the flow can be assessed without an email service.
  const code=String(Math.floor(100000+Math.random()*900000));
  sessionStorage.setItem("smartwash_reset_email",email);
  sessionStorage.setItem("smartwash_reset_code",code);
  setMessage("forgotMessage","Demo verification code: "+code+" (real email delivery needs a backend).",true);
  resendSeconds=43;document.getElementById("resendTimer").textContent=resendSeconds+"s";
  if(resendInterval)clearInterval(resendInterval);
  resendInterval=setInterval(()=>{resendSeconds--;document.getElementById("resendTimer").textContent=Math.max(0,resendSeconds)+"s";if(resendSeconds<=0)clearInterval(resendInterval)},1000);
  if(!users[email])showToast("Demo code generated. No registered account was found.");
  else showToast("Verification code generated for "+email);
});
function reserveMachine(name){
  showInfo("Booking confirmed",name+" has been reserved in this prototype. A real booking system needs a backend and availability database.");
}
function notifyMachine(name){showToast("You'll be notified when "+name+" becomes available (demo).")}
window.addEventListener("DOMContentLoaded",()=>{
  const last=localStorage.getItem("smartwash_last_email");
  if(last)document.getElementById("signinEmail").value=last;
});