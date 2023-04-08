type TMovie = {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
};

type TMovieRequest = Omit<TMovie, 'id'>;

export { TMovie, TMovieRequest };
