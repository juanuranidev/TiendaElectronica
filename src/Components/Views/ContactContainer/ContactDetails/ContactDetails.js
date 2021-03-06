import { React, useState} from 'react';
import { collection, getFirestore, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import Message from '../../../Message/Message';
import './_ContactDetails.scss';

const ContactDetails = () => {
    const [messageSent, setMessageSent] = useState(false)
    const [captchaValue, setCaptchaValue] = useState(false)
    const [userInfo, setUserInfo] = useState({name: '', mail: '', message: '',})
    const requiredInputs = [userInfo.name, userInfo.mail, userInfo.message]

    const handleChange = (e) => {
        setUserInfo({
          ...userInfo,
          [e.target.name] : e.target.value
        })
    }
    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        setUserInfo({
            name: userInfo.name,
            mail: userInfo.mail,
            message: userInfo.message,
        })
    }

    const sendMessage = async (userInfo) => {
        let message = {}
        message.name = userInfo.name
        message.mail = userInfo.mail
        message.content = userInfo.message

        const dataBase = getFirestore()
        const messageCollection = collection(dataBase, 'messages') 
        await addDoc(messageCollection, message)
        .catch(err => console.log(err))
        .finally (() => setMessageSent(true))
    }

    const onChange = (value) => {
        value!==null
        ? setCaptchaValue(true)
        : setCaptchaValue(false)
    }
    
    const alert = () => {
        if(captchaValue===false){
            const invalidCaptcha = () => toast.warn('Completa el captcha')
            invalidCaptcha()
        } else {
            const emptyValues = () => toast.warn('Completa todos los campos obligatorios')
            emptyValues()
        }
    }

    if(messageSent===true){
        return (
            <Message h2={'Mensaje enviado'} p={'¡Pronto nos pondremos en contacto!'} />
        )
    }

    return (
        <div className='contactDetails'>
            <div className='contactForm'>
                <form onSubmit={handleSubmit} className='contactForm_form'>
                    <label className='contactForm_form_label'>Nombre</label>
                        <input type='text' name='name' placeholder='Nombre*' value={userInfo.name} onChange={handleChange} className='contactForm_form_input'/>
                    <label className='contactForm_form_label'>Correo</label>
                        <input type='text' name='mail' placeholder='Correo electrónico*' value={userInfo.mail} onChange={handleChange} className='contactForm_form_input'/>
                    <label className='contactForm_form_label'>Mensaje</label>
                        <textarea type='textarea' name='message' placeholder='Mensaje*' value={userInfo.message} onChange={handleChange} className='contactForm_form_input textarea'/>
                <div className='contactDetails_captcha'>
                    <ReCAPTCHA sitekey='6LdHNlMeAAAAAPYxij6HQL-YkX_UlECRLenn-l9v' onChange={onChange} onExpired={onchange} />
                </div>
                {captchaValue===false || requiredInputs.includes('')
                ?  <button className='contactDetails_button opacity' onClick={() => alert()}> No Enviar</button>
                :  <button className='contactDetails_button' type='submit' onClick={() => sendMessage(userInfo)}>Enviar</button>
                }
                </form>
            </div>
        </div>
    );
};

export default ContactDetails;