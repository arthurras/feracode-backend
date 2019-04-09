
# FeraCode Test - Backend

This is the Backend server for FeraCode Test.

## Project URLs

This project is hosted on an Amazon Server.
You can access the API base url [here](http://arthurras.ddns.net/api/v1).
If you want access the hosted Web project, click [here](http://arthurras.ddns.net)


## Project Standards

This project uses NodeJS, with ExpressJS and CouchDB.
All requests and responses use JSON API standards.


## Available routes

|Method    |Route                                |Description                  |
|----------|-------------------------------------|-----------------------------|
|`[GET]`   |/diapers                             |List all diapers             |
|`[POST]`  |/diapers                             |Create diaper                |
|`[GET]`   |/diapers/:diaper_id                  |Get specific diaper          |
|`[PACTH]` |/diapers/:diaper_id                  |Update specific diaper       |
|`[DELETE]`|/diapers/:diaper_id                  |Delete diaper                |
|`[POST]`  |/orders                              |Create order                 |
|`[POST]`  |/sizes                               |Create size                  |
|`[GET]`   |/sizes/:size_id                      |Get size                     |
|`[POST]`  |/stocks                              |Create stock                 |
|`[GET]`   |/stocks/:stock_id                    |Get specific stock           |
|`[PACTH]` |/stock/:stock_id                     |Update specific stock        |


## Models - Schemas

In this project, 4 models were created: Diaper, Size, Stock, and Order.

### Schema definitions

The basic information from a diaper - name, and description - is store in Diapers. The basic information from a size - name - is store in Size.

Stock have the information from a Diaper stock. Each stock has the diaper ID, size ID, total stock and the total minutes until the stock is zeroed.

Each order has the stock ID and time.

### Purchase

When the user clicks to purchase a diaper, by clicking in the desired size, the API receives a request on `[POST]` /orders, containing the desired stock ID.

The API will save the order using the stock, after decrease the stock amount and calculate the time until the new stock is zeroed.

After that, the API returns the order information, and the client request the updated data for the current stock.

### Sizes

All sizes are created by a user and can be used by in different diapers. This prevents the user from creating equal sizes with different names.
