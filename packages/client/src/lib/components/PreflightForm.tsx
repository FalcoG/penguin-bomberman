import InputFieldDescription from './form/InputFieldDescription'
import InputFieldError from './form/InputFieldError'

const PreflightForm = () => {
  return <form>
    <label htmlFor="username">
      Nickname
    </label>
    <InputFieldDescription>
      This is the name that other players will see
    </InputFieldDescription>
    <input type="text" id="username" name="username"/>
    {` `}
    <button>Join lobby</button>
    <InputFieldError>Your nickname must only contain alphanumeric characters</InputFieldError>
    <InputFieldError>The name <b>"replaceme"</b> is already being used</InputFieldError>
  </form>
}

export default PreflightForm
