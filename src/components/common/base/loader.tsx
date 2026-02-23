import style from './loader.module.scss';

function Loader() {
  return (
    <div className={style['loader-box']}>
      <div className={style.loader} />
    </div>
  );
}

export default Loader;
