module.exports = (catchFunction) => {
  return (request, response, next)=>{ 
  catchFunction(request, response, next).catch(next);
  }
}
