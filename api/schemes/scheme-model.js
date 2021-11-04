const db = require('../../data/db-config')

async function find() { 
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .orderBy('sc.scheme_id', 'asc')
  return rows
}

async function findById(scheme_id) { 
  const steps = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  if (!steps.length) {
    return null
  }

  return {
    "scheme_id": Number(scheme_id),
    "scheme_name": steps[0].scheme_name,
    "steps": steps
      .filter(step => step.step_id)
      .map(({ step_id, step_number, instructions }) => ({ step_id, step_number, instructions }))
  }
}

async function findSteps(scheme_id) { 
  const rows = await db('steps as st')
    .join('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .select('st.step_number', 'st.step_id', 'st.instructions', 'sc.scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('step_number')
  return rows
}

async function add(scheme) { 
  const ids = await db('schemes').insert(scheme)
  return findById(ids[0])
  }

async function addStep(scheme_id, step) { 

  await db('steps').insert({ ...step, scheme_id })
  return findSteps(scheme_id)
  }

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
