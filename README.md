# Running

```js
yarn   // install all dependencies
yarn test // run test
```

# Sub Optimal Decisions

- Id

Choosing uuid for the id was mainly because of duplicate id's for an order due concurrency. Using a uuid will have its downsides long term in terms of time complexity, storage. Based on the time constraints for this project , I believe it was a better option.

- Sell/Buy

Due to the self balancing nature of priorty queue, storing the buy and sell orders in max and min priority queue respectively would have been a better choice. Currently, the time complexity of sell and buy functions are `O(n^2)` but with a priority queue, they could be improved to `O(log(n))`
