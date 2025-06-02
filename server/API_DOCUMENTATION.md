## MyFinanceTracker - Budgeting Application - Server / API Documentation

|Endpoint|Request Type|Parameters|Response Codes|
|-----|-----|-----|-----|
| `/` | `GET` | none | This is a connection test only - will reply with message "Hello World." |
| `/api/register` | `POST` | `email` - account email<br>`password` - account password | `201` - successful account creation<br>`409` - an account using this email already exists |
| `/api/login` | `POST` | `email` - account email<br>`password` - account password | `200` - successful login <br>`401` - incorrect email or password, or the account does not exist |
| `/api/logout` | `POST` | none | `200` - successful logout <br>`401` - invalid request credentials |
| `/api/profile` | `PUT` | The following should be included in the request, but `null` to remain as the currently associated value<br><br>`pfp` - profile picture<br>`email` - new account email<br>`pass` - new account password | `200` - successful profile update<br>`401` - invalid request credentials<br>`409` - an account using the new email already exists |
| `/api/profile` | `DELETE` | none | `200` - successfully deleted the profile<br>`401` - invalid request credentials |
| `/api/transactions` | `GET` | none | `200` - successfully retrieved transactions<br>`401` - invalid request credentials |
| `/api/transactions` | `POST` | `catId` - category id to associate with this transaction<br>`name` - transaction name<br>`amt` - amount for this transaction<br>`date` - date associated w/ the transaction | `200` - successfully created new transactions<br>`401` - invalid request credentials |
| `/api/transactions` | `PUT` | `id` - ID for the transaction being updated<br>`catId` - (new) category ID for the transaction<br>`name` - (new) transaction name<br>`amt` - (new) amount for this transaction<br>`date` - (new) date for this transaction | `200` - successfully updated transaction<br>`401` - invalid request  credentials<br>`404` - no transaction with the specified ID exists |
| `/api/transactions` | `DELETE` | `id` - ID of the transaction being deleted | `200` - successfully deleted transaction, or no such transaction exists<br> `401` - invalid request credentials |
| `/api/categories` | `GET` | none | `200` - successfully retrieved categories<br>`401` - invalid request credentials |
| `/api/categories` | `POST` | `name` - name for this category<br>`isExpense` - whether this category is an expense (true), or an income (false)<br>`budget` - amount to set as the monthly goal / target for this category | `200` - successfully created new category<br>`401` - invalid request credentials |
| `/api/categories` | `PUT` | `id` - ID of the category being updated<br>`name` - (new) name for this category<br>`isExpense` - (updated) income / expense status<br>`budget` - (new) amount to set as the monthly goal / target for this category | `200` - successfully updated category<br>`401` - invalid request credentials<br>`404` - no category with the specified ID exists |
| `/api/categories` | `DELETE` | `id` - ID of the category being deleted | `200` - successfully deleted category<br>`401` - invalid request credentials |