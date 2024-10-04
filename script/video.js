function getTimeString(time){
    const year = parseInt(time/31536000);
    let remainingSecond = time % 31536000;
    const day = parseInt(remainingSecond/86400);
     remainingSecond = remainingSecond % 86400;
    const hour = parseInt(remainingSecond/3600);
     remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond/60);
    remainingSecond = remainingSecond % 60;
    return `${year}y ${day}d ${hour}h ${minute}m ${remainingSecond}s`;
}



const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    for(let btn of buttons){
        btn.classList.remove("active");
    }
};

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};
const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        removeActiveClass();
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active");
        displayVideos(data.category)
    })
    .catch((error) => console.log(error));
};



const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");
    categories.forEach((item) => {
        const buttonContainer = document.createElement("div");
       buttonContainer.innerHTML = `
       <button id="btn-${item.category_id}"  onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">${item.category}</button>

       
       `
        categoryContainer.append(buttonContainer);

    });
};

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);
};
const displayDetails = (video) => {
    const detailsContainer = document.getElementById("modal-content");
    detailsContainer.innerHTML = ` 
    <img src="${video.thumbnail}" />
    <p>${video.description} </p>
    `;
    document.getElementById("showModalData").click();
};
document.getElementById("Search-input").addEventListener("keyup",(e) => {
    loadVideos(e.target.value);

})


const displayVideos = (videos) => {
    const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML = "";
    if(videos.length==0)
    {
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML = `
        <div class="min-h-[300px] w-full flex flex-col gap-5 justify-center items-center">
        <img src="images/Icon.png" />
         <h2 class="text-2xl font-bold">No Content Here </h2>

        `;
        return;
    }
    else{
        videoContainer.classList.add("grid");
    }


    videos.forEach((video) => {
        console.log(video);
        const card = document.createElement("div");
        card.classList = "card card-compact";
        card.innerHTML = ` 
        <figure class="h-[200px] relative">
           <img
           class="h-full w-full object-cover"
            src=${video.thumbnail}
            alt="Shoes" />
            ${video.others.posted_date?.length==0 ? " " :`<span class="absolute right-2 bottom-2 bg-black p-1 text-white">${getTimeString(video.others.posted_date)}`}
            
       </figure>
       <div class="px-0 py-2 flex gap-2">
       <div><img class="w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}" /></div>
       <div>
          <h2 class="font-bold">${video.title}</h2>
          <div class="flex gap-2">
              <p>${video.authors[0].profile_name}</p>
            
               ${video.authors[0].verified==true ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" />` : ""}
        
            </div>
            <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button>
       </div>


         
       </div>
        
        `;
        videoContainer.append(card);

    });
};









loadCategories();
loadVideos();