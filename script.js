const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const entree_entry = document.getElementById('meals');
const search_result = document.getElementById('search-result');
const displayed_meal = document.getElementById('displayed-meal');



// fetch random meal from API
function getRandomMeal() {
  // clear meals and heading
  entree_entry.innerHTML = '';
  search_result.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      mealDetails(meal);
    });
}



// search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();
  // clear single meal
  displayed_meal.innerHTML = '';
  // Get search term
  const term = search.value;
  // check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        search_result.innerHTML = `<h2>Search results for '${term}':</h2>`;
        console.log(data);
        if (data.meals === null) {
          search_result.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          entree_entry.innerHTML = data.meals.map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>`
            )
            .join('');
        }
      });
    // clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}



// fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      mealDetails(meal);
    });
}



// scroll to what is displayed
function scollToMeal() {
var scroll = document.getElementById("displayed-meal");
scroll.scrollIntoView();
}



// details for instructions and ingrediants
function mealDetails(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  scollToMeal();
  // what will be displayed to user
  displayed_meal.innerHTML = `
    <div class="displayed-meal">
    <br>
    <hr>
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    </div>`;
}



// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
entree_entry.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
