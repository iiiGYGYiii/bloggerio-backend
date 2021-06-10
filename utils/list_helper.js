
const dummy = blogs =>{

  return blogs ? 1 : 1;
};

const totalLikes = (blogs) =>{
  return blogs.reduce((acc,current)=>{
    return acc + current.likes;
  },
  0);
};

const mostLiked = blogs =>{
  // const maxLikes = Math.max(...blogs.map(item => item.likes));
  // const mostLiked = blogs.filter(item => item.likes === maxLikes);
  const mostLiked = blogs.sort((a,b)=> b.likes-a.likes);
  return {
    title: mostLiked[0].title,
    author: mostLiked[0].author,
    likes: mostLiked[0].likes
  };
};

const mostActiveAuthors = blogs =>{
  const authorArray = blogs.map(blog => blog.author);
  const authors = [...new Set(authorArray)];
  const countAuthors = authors.map(author => {
    return {
      author:author,
      blogs: authorArray.filter(authorf => authorf===author).length
    };
  });
  const mostActiveAuthor = countAuthors.sort((a,b)=>b.blogs-a.blogs);
  return mostActiveAuthor[0];
};

const mostLikedAuthor = (blogs) =>{
  const authors = [...new Set(blogs.map(blog=>blog.author))];
  const blogsByAuthors = authors.map(author => blogs.filter(blog=> blog.author===author));
  const likesByAuthors = blogsByAuthors.map(blogs => {
    return blogs.reduce((acc, blog) =>{
      return{
        author: blog.author,
        likes: acc.likes+blog.likes
      };
    },{
      likes: 0
    });
  });
  const mostLiked = likesByAuthors.sort((a,b)=>b.likes-a.likes)[0];
  return mostLiked;
};

module.exports = {
  dummy,
  totalLikes,
  mostLiked,
  mostActiveAuthors,
  mostLikedAuthor
};
