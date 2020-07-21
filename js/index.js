const BOOK_URL = "http://localhost:3000/books";
const USER_URL = "http://localhost:3000/users";
let current_user = { id: 1, username: "pouros" };
document.addEventListener("DOMContentLoaded", function () {
  const listPanel = document.getElementById("list-panel");
  const list = document.getElementById("list");

  fetchBooks(BOOK_URL);
});

function fetchBooks(url){
fetch(url)
  .then((response) => response.json())
  .then((books) => listBooks(books));
}

function listBooks(books) {
  books.forEach((book) => {
    listBook(book);
  });
}

function listBook(book) {
  const bookLi = document.createElement("li");
  bookLi.textContent = book.title;
  list.appendChild(bookLi);
  bookLi.addEventListener("click", () => {
    showBook(book);
  });
}

function showBook(book) {
  const showPanel = document.getElementById("show-panel");
  //clear the panel
  showPanel.innerHTML = "";
  //add the cover image
  const bookImg = document.createElement("img");
  bookImg.src = book.img_url;
  showPanel.appendChild(bookImg);
  //add the book title
  const bookTitle = document.createElement("h1");
  bookTitle.textContent = book.title;
  showPanel.appendChild(bookTitle);
  // add the subtitle
  const bookSubtitle = document.createElement("h2");
  bookSubtitle.textContent = book.subtitle;
  showPanel.appendChild(bookSubtitle);
  // add the author
  const bookAuthor = document.createElement("h3");
  bookAuthor.textContent = book.author;
  // add the description
  const bookDescription = document.createElement("p");
  bookDescription.textContent = book.description;
  showPanel.appendChild(bookDescription);
  // add the like list
  const likeList = document.createElement("ul");
  book.users.forEach( user => {
    addToLikeList(user, likeList);
  });
  showPanel.appendChild(likeList);
  // add the like button
  const likeButton = document.createElement("button");
  if (book.users.some( user => user.id === current_user.id)) {
  likeButton.textContent = "UNLIKE!";
  } else {
    likeButton.textContent = "LIKE!";
  }
  likeButton.dataset.bookId = book.id;
  showPanel.appendChild(likeButton);
  likeButton.addEventListener("click", () => {
    likeBook(book, likeList);
  });
}
function addToLikeList(user, likeList) {
userLi = document.createElement("li");
    userLi.textContent = user.username;
    userLi.dataset.userId = user.id;
    likeList.appendChild(userLi);
}

function likeBook(book, likeList) {

  let newLikeList = []
  if (book.users.some(user => user.id === current_user.id)) {
    newLikeList = book.users.filter(user => user.id !== current_user.id)
  } else {
    newLikeList = book.users
    newLikeList.push(current_user)
  }
  

  let patchRequest = {
    method: 'PATCH',
    headers: {
      'Content-Type': "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({users: newLikeList})
  }

  fetch(`${BOOK_URL}/${book.id}`, patchRequest)
  .then(response => response.json())
  .then(book => showBook(book))
}

