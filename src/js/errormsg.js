

const errormessages=(e,er1)=>{
  const errormsg=[];
  er1.forEach(ee => {
    errormsg.push(e.errors[ee].message)
  })
  return errormsg
}

module.exports=errormessages
