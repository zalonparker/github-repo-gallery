//Div where profile information will appear
const overview = document.querySelector(".overview");
//Github username
const username = "zalonparker";
//Repo list
const repoList = document.querySelector(".repo-list");
//Section where all repo information appears
const allReposInfo = document.querySelector(".repos");
//Section where the individual repo data appears
const repoData = document.querySelector(".repo-data");
//Back to Repo Gallery button
const viewReposButton = document.querySelector(".view-repos");
//The input with the "Search by name" placeholder
const filterInput = document.querySelector(".filter-repos");

//Fetch user data
const githubUserInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};

githubUserInfo();

//Fetch & display user information
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
    `;
    overview.append(div);
    gitRepos();
};

//Fetch repos
const gitRepos = async function () {
    const getRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await getRepos.json();
    displayRepos(repoData);
};

//Display info about repos
const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

//Click event on the unordered list with the class of "repo-list" 
//with conditional statement to check if the event target matches the <h3> element
//(i.e., the name of the repo)

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

//Function to get specific repo information
const getRepoInfo = async function (repoName) {
    const ownerInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await ownerInfo.json();
    console.log(repoInfo);
    //Fetch languages
    const getLanguages = await fetch(repoInfo.languages_url);
    const languageData = await getLanguages.json();
    //console.log(languageData);

    //List of languages
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    //console.log(languages);
    displayRepoInfo(repoInfo, languages);
};

//Display specific repo information
const displayRepoInfo = function (repoInfo, languages) {
    viewReposButton.classList.remove("hide");
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    allReposInfo.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
};

//Click event for the back button
viewReposButton.addEventListener("click", function () {
    allReposInfo.classList.remove("hide");
    repoData.classList.add("hide");
    viewReposButton.classList.add("hide");
});

//Dynamic search
filterInput.addEventListener("input", function (e) {
    const captureValue = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const valueLowerCase = captureValue.toLowerCase();

    for (const repo of repos) {
        repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(valueLowerCase)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});