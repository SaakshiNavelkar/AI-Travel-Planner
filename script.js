/* ============================= */
/* Intro → Splash */
/* ============================= */

setTimeout(function(){

document.getElementById("intro-screen").style.display="none";
document.getElementById("splash-screen").style.display="flex";

},3000);


/* ============================= */
/* Splash → Planner */
/* ============================= */

document.getElementById("start-btn").addEventListener("click",function(){

document.getElementById("splash-screen").style.display="none";
document.getElementById("planner-form").style.display="block";

});


/* ============================= */
/* Destination Autofill */
/* ============================= */

const suggestions=document.querySelectorAll(".suggestion");

suggestions.forEach(function(place){

place.addEventListener("click",function(){

document.getElementById("destination").value=place.innerText;

});

});


/* ============================= */
/* Generate Trip */
/* ============================= */

document.getElementById("generate-btn").addEventListener("click",async function(){

const destination=document.getElementById("destination").value;
const days=document.getElementById("days").value;
const budget=document.getElementById("budget").value;
const food=document.getElementById("food").value;

if(destination===""||days===""){
alert("Please fill all required fields");
return;
}

document.getElementById("planner-form").style.display="none";
document.getElementById("loading-screen").style.display="flex";

const itinerary=await generateAIItinerary(destination,days,budget,food);

setTimeout(function(){

displayItinerary(itinerary);

},2000);

});


/* ============================= */
/* BACKEND API CALL (UPDATED) */
/* ============================= */

async function generateAIItinerary(destination,days,budget,food){

try{

const response = await fetch("https://ai-travel-backend-6rui.onrender.com/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
destination,
days,
budget,
food
})
});

if(!response.ok){
throw new Error("Server error");
}

const data = await response.json();

console.log("Backend response:", data);

if(!data.candidates){
return "Failed to generate itinerary.";
}

return data.candidates[0].content.parts[0].text;

}catch(error){

console.error("ERROR:", error);
return "Failed to generate itinerary. Please try again.";

}

}


/* ============================= */
/* Display Itinerary */
/* ============================= */

function displayItinerary(text){

document.getElementById("loading-screen").style.display="none";
document.getElementById("results-screen").style.display="block";

const itineraryContainer=document.getElementById("itinerary");
itineraryContainer.innerHTML="";

if(text.includes("Failed")){
itineraryContainer.innerHTML="<p>"+text+"</p>";
return;
}

/* Clean unwanted AI symbols */

text=text.replace(/---/g,"");
text=text.replace(/\*\*/g,"");
text=text.replace(/\*/g,"");

/* Remove travel tips */

const tipsIndex=text.toLowerCase().indexOf("travel tips");

if(tipsIndex!==-1){
text=text.substring(0,tipsIndex);
}

/* Split days */

const sections=text.split(/Day\s*\d+/).filter(s=>s.trim()!="");

sections.forEach(function(day,index){

const lines=day.trim().split("\n").filter(l=>l.trim()!="");

let places=[];
let restaurant="";
let dish="";

lines.forEach(line=>{

line=line.trim();

/* Detect places */

if(line.toLowerCase().includes("places")){
return;
}

/* Restaurant */

if(line.toLowerCase().includes("restaurant suggestion")){
restaurant=line.split(":")[1]?.trim() || "";
return;
}

/* Dish */

if(line.toLowerCase().includes("dish to try")){
dish=line.split(":")[1]?.trim() || "";
return;
}

/* Otherwise it's a place */

if(!restaurant && !dish){
places.push(line);
}

});

/* fallback */

if(restaurant===""){
restaurant="Recommended Local Restaurant";
}

if(dish===""){
dish="Local Special Dish";
}

/* create card */

const card=document.createElement("div");
card.className="day-card";

card.innerHTML=`

<h3>📅 Day ${index+1}</h3>

<p><strong>📍Places to Visit</strong></p>
<p>${places.join("<br>")}</p>

<p><strong>🍽️ Restaurant Suggestion</strong></p>
<p>${restaurant}</p>

<p><strong>🍜 Dish to Try</strong></p>
<p>${dish}</p>

`;

itineraryContainer.appendChild(card);

});

}


/* ============================= */
/* Copy Plan */
/* ============================= */

document.getElementById("copy-btn").addEventListener("click",function(){

const text=document.getElementById("itinerary").innerText;

navigator.clipboard.writeText(text);

alert("Plan copied!");

});


/* ============================= */
/* Download Plan */
/* ============================= */

document.getElementById("download-btn").addEventListener("click",function(){

const text=document.getElementById("itinerary").innerText;

const blob=new Blob([text],{type:"text/plain"});

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);
link.download="travel-plan.txt";

link.click();

});


/* ============================= */
/* New Plan */
/* ============================= */

document.getElementById("new-plan-btn").addEventListener("click",function(){

document.getElementById("results-screen").style.display="none";
document.getElementById("planner-form").style.display="block";

});