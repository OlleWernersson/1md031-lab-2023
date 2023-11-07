//alert('hej')

//const skills = ["Web Design","Graphic Design","SEO Optimitation","Interaction Design"];
const skills = [
{
    skill: "Web Design",
    proficiency: "Good"
},
{
    skill: "Graphic Design",
    proficiency: "Very Good"
},
{
    skill: "SEO Optimazation",
    proficiency: "Master"
}
]


let myLi, mySpan;

for (let skill of skills) {
    myLi = document.createElement("li")
    myLi.textContent = skill.skill
    mySpan = document.createElement("span")
    mySpan.setAttribute("class", skill.proficiency.replace(/\s/g, '')) //remove space.
    mySpan.textContent = " " + skill.proficiency
    myLi.appendChild(mySpan)
    document.getElementById("skills").appendChild(myLi)
}



