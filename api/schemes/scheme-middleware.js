const Scheme = require('./scheme-model')

const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.scheme_id)
    if (!scheme) {
      next({
        status: 404,
        message: `scheme with scheme_id ${req.params.scheme_id} not found`
      })
    } else {
      req.scheme = scheme
      next()
    }
  } catch (error) {
    next(error)
  }
}

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body
  if (!scheme_name || scheme_name.length === 0
    || typeof scheme_name !== 'string') return next({
      status: 400,
      message: 'invalid scheme_name'
    })
  next()

}

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body
  if (!instructions || instructions.length === 0
    || typeof instructions !== 'string' || step_number < 1
    || typeof step_number !== 'number' || isNaN(step_number)
  ) return next({
    status: 400,
    message: 'invalid step'
  })
  next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
