const listHelper = require("../utils/list_helper");

describe("Dummy", () =>{
  test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("Most liked blog", ()=>{
  const listOfBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422aa71b44a676234d18f7",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.XD.com/",
      likes: 12,
      __v:0
    },
    {
      _id: "5a323aa71b44a676234d18f7",
      title: "Another Thing",
      author: "Edsger W. Dijkstra",
      url: "http://www.XD.com/",
      likes: 3,
      __v:0
    },
    {
      _id: "5a3aa71b44a676234d18f7",
      title: "Most Liked",
      author: "Edsger W. Dijkstra",
      url: "http://www.XD.com/",
      likes: 51,
      __v:0
    }
  ];
  test("when list has more than one item, returns the most liked blog", ()=>{
    expect(listHelper.mostLiked(listOfBlogs)).toEqual({
      title: "Most Liked",
      author: "Edsger W. Dijkstra",
      likes: 51,
    });
  });
});

describe("Most active author", ()=>{
  test("equals to the most active author", ()=>{
    const listOfBlogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Anastasia",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      },
      {
        _id: "5a422aa71b44a676234d18f7",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.XD.com/",
        likes: 12,
        __v:0
      },
      {
        _id: "5a323aa71b44a676234d18f7",
        title: "Another Thing",
        author: "Curie",
        url: "http://www.XD.com/",
        likes: 3,
        __v:0
      },
      {
        _id: "5a3aa71b44a676234d18f7",
        title: "Most Liked",
        author: "Edsger W. Dijkstra",
        url: "http://www.XD.com/",
        likes: 51,
        __v:0
      }
    ];
    expect(listHelper.mostActiveAuthors(listOfBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 2
    });
  });
});

describe("Most liked author", () =>{
  test("author with most likes", () =>{
    const listOfBlogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Anastasia",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      },
      {
        _id: "5a422aa71b44a676234d18f7",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.XD.com/",
        likes: 12,
        __v:0
      },
      {
        _id: "5a323aa71b44a676234d18f7",
        title: "Another Thing",
        author: "Curie",
        url: "http://www.XD.com/",
        likes: 3,
        __v:0
      },
      {
        _id: "5a3aa71b44a676234d18f7",
        title: "Most Liked",
        author: "Edsger W. Dijkstra",
        url: "http://www.XD.com/",
        likes: 51,
        __v:0
      }
    ];
    expect(listHelper.mostLikedAuthor(listOfBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 63
    });
  });
});