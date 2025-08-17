import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';
import { login } from "../../services/auth.service";
import styles from './login.module.css'; // Importa el módulo de CSS

type Props = {}

const Login: React.FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("!Ingresar Username!"),
    password: Yup.string().required("!Ingresar Contraseña!"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setMessage("");
    setLoading(true);

    login(username, password).then(
      () => {
        navigate("/");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.cardContainer}>
        <h1>Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className={styles.inputBox}>
              <label htmlFor="username">Username </label>
              <Field name="username" placeholder='Usuario' type="text" className={styles.formControl} required />
              
              <ErrorMessage
                name="username"
                component="div"
                className={`${styles.alert} ${styles.alertDanger}`}
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="password">Password</label>
              
              <Field name="password" type="password" placeholder='Contraseña' className={styles.formControl} />
              <ErrorMessage
                name="password"
                component="div"
                className={`${styles.alert} ${styles.alertDanger}`}
              />
            </div>

            <div className={styles.rememberForgot}>
              <label>
                <input type='checkbox' /> Recordar usuario
              </label>
            </div>

            <div className={styles.formGroup}>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading && (
                  <span className={styles.spinnerBorder}></span>
                )}
                <span>Login</span>
              </button>
            </div>

            <div className={styles.registerLink}>
              <p>¿No tienes usuario? <Link to="/register">Regístrate aquí</Link></p>
            </div>

            {message && (
              <div className={styles.formGroup}>
                <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
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

export default Login;
