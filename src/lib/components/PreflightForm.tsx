import InputFieldDescription from './form/InputFieldDescription'

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
  </form>
}

export default PreflightForm
