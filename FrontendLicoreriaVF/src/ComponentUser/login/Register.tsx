import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import IUser from "../../types/user.type";
import { register } from "../../services/auth.service";
import styles from './register.module.css';

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate(); // Hook para la navegación


  const initialValues: IUser = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener entre 3 y 20 caracteres.")
      .max(20, "El nombre de usuario debe tener entre 3 y 20 caracteres.")
      .required("¡Este campo es obligatorio!"),
    email: Yup.string()
      .email("Este no es un correo electrónico válido.")
      .required("¡Este campo es obligatorio!"),
    password: Yup.string()
      .min(6, "La contraseña debe tener entre 6 y 40 caracteres.")
      .max(40, "La contraseña debe tener entre 6 y 40 caracteres.")
      .required("¡Este campo es obligatorio!"),
  });

  const handleRegister = (formValue: IUser) => {
    const { username, email, password } = formValue;

    register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate("/login");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1>Registro</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Nombre de Usuario</label>
                  <Field name="username" type="text" className={styles.formControl} />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className={`${styles.alert} ${styles.alertDanger}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo Electrónico</label>
                  <Field name="email" type="email" className={styles.formControl} />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={`${styles.alert} ${styles.alertDanger}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Contraseña</label>
                  <Field
                    name="password"
                    type="password"
                    className={styles.formControl}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className={`${styles.alert} ${styles.alertDanger}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <button type="submit" className={styles.btnPrimary}>Registrarse</button>
                </div>

                <div className={styles.registerLink}>
                  <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                </div>
              </div>
            )}

            {message && (
              <div className={styles.formGroup}>
                <div
                  className={
                    successful ? `${styles.alert} ${styles.alertSuccess}` : `${styles.alert} ${styles.alertDanger}`
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
