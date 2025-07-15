export const teams = [
    {
      id: "team-001",
      name: "Thunderbolts",
      abbrev: "THB",
      ageGroup: "U16",
      genGroup: "Coed",
      player_count: 3,
      players: [
        { id: "p1", firstName: "Liam", lastName: "Carter", age: 15, position: "Forward", gender: "Male" },
        { id: "p2", firstName: "Ava", lastName: "Nguyen", age: 14, position: "Midfielder", gender: "Female" },
        { id: "p3", firstName: "Noah", lastName: "Smith", age: 15, position: "Defender", gender: "Male" },
      ],
      owner: { id: '123456789', first: "Liam", last: "West", email: "liam.west@example.com", password: "test1234" },
      managers: [
        { id: '123456788', first: "Ava", last: "Tran", email: "ava.tran@example.com", password: "test1234" }
      ],
      scorekeepers: [],
      colors: {
        home: "#1E90FF",
        away: "#D3D3D3"
      }
    },
    {
      id: "team-002",
      name: "Crimson Hawks",
      abbrev: "CHW",
      ageGroup: "U18",
      genGroup: "Male",
      player_count: 2,
      players: [
        { id: "p4", firstName: "James", lastName: "Lee", age: 17, position: "Goalkeeper", gender: "Male" },
        { id: "p5", firstName: "Ethan", lastName: "Kim", age: 18, position: "Forward", gender: "Male" },
      ],
      owner: { id: '123456779', first: "Ethan", last: "Kim", email: "ethan.kim@example.com", password: "test1234" },
      managers: [
        { id: '123456789', first: "Liam", last: "West", email: "liam.west@example.com", password: "test1234" }
      ],
      scorekeepers: [],
      colors: {
        home: "#B22222",
        away: "#FFFFFF"
      }
    },
    {
      id: "team-003",
      name: "Emerald Flames",
      abbrev: "EFL",
      ageGroup: "U12",
      genGroup: "Female",
      player_count: 3,
      players: [
        { id: "p6", firstName: "Mia", lastName: "Johnson", age: 11, position: "Forward", gender: "Female" },
        { id: "p7", firstName: "Sophia", lastName: "Garcia", age: 12, position: "Midfielder", gender: "Female" },
        { id: "p8", firstName: "Emily", lastName: "Brown", age: 11, position: "Defender", gender: "Female" },
      ],
      owner: { id: "987654321", first: "Cara", last: "Williams", email: "cara.williams@example.com", password: "test1234" },
      managers: [
        { id: "987654322", first: "Emily", last: "Stone", email: "emily.stone@example.com", password: "test1234" }
      ],
      scorekeepers: [
        { id: "987654332", first: "Daniel", last: "Clark", email: "daniel.clark@example.com", password: "test1234" }
      ],
      colors: {
        home: "#228B22",
        away: "#FFD700"
      }
    },
    {
      id: "team-004",
      name: "Silver Sharks",
      abbrev: "SSK",
      ageGroup: "Adult",
      genGroup: "Male",
      player_count: 2,
      players: [
        { id: "p9", firstName: "Jake", lastName: "Miller", age: 24, position: "Midfielder", gender: "Male" },
        { id: "p10", firstName: "Ryan", lastName: "Cooper", age: 26, position: "Defender", gender: "Male" },
      ],
      owner: { id: "987654323", first: "Jake", last: "Miller", email: "jake.miller@example.com", password: "test1234" },
      managers: [],
      scorekeepers: [],
      colors: {
        home: "#C0C0C0",
        away: "#000000"
      }
    },
    {
      id: "team-005",
      name: "Golden Phoenix",
      abbrev: "GPH",
      ageGroup: "U14",
      genGroup: "Female",
      player_count: 2,
      players: [
        { id: "p11", firstName: "Isabella", lastName: "Martinez", age: 13, position: "Forward", gender: "Female" },
        { id: "p12", firstName: "Chloe", lastName: "Taylor", age: 14, position: "Defender", gender: "Female" },
      ],
      owner: { id: "987654324", first: "Natalie", last: "Reed", email: "natalie.reed@example.com" , password: "test1234" },
      managers: [
        { id: "987654325", first: "Grace", last: "Evans", email: "grace.evans@example.com", password: "test1234" }
      ],
      scorekeepers: [],
      colors: {
        home: "#FFD700",
        away: "#8B0000"
      }
    },
    {
        id: "team-006",
        name: "Blue Vipers",
        abbrev: "BVP",
        ageGroup: "U16",
        genGroup: "Coed",
        player_count: 2,
        players: [
          { id: "p13", firstName: "Lucas", lastName: "Wright", age: 15, position: "Forward", gender: "Male" },
          { id: "p14", firstName: "Ella", lastName: "Robinson", age: 14, position: "Defender", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#0000FF",
          away: "#F5F5F5"
        }
      },
      {
        id: "team-007",
        name: "Scarlet Panthers",
        abbrev: "SCP",
        ageGroup: "U18",
        genGroup: "Female",
        player_count: 2,
        players: [
          { id: "p15", firstName: "Zoe", lastName: "Hall", age: 17, position: "Midfielder", gender: "Female" },
          { id: "p16", firstName: "Lily", lastName: "Adams", age: 16, position: "Forward", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#DC143C",
          away: "#FFFFFF"
        }
      },
      {
        id: "team-008",
        name: "Iron Wolves",
        abbrev: "IRW",
        ageGroup: "Adult",
        genGroup: "Male",
        player_count: 2,
        players: [
          { id: "p17", firstName: "Nathan", lastName: "Scott", age: 25, position: "Defender", gender: "Male" },
          { id: "p18", firstName: "Caleb", lastName: "Davis", age: 27, position: "Midfielder", gender: "Male" }
        ],
        owner: {
          id: '123456789', 
          first: "Liam",
          last: "West",
          email: "liam.west@example.com", 
          password: "test1234" 
        },
        managers: [{
          id: '123456789',
          first: "Liam",
          last: "West",
          email: "liam.west@example.com", 
          password: "test1234" 
        }],
        scorekeepers: [],
        colors: {
          home: "#808080",
          away: "#E0E0E0"
        }
      },
      {
        id: "team-009",
        name: "Golden Lynx",
        abbrev: "GLX",
        ageGroup: "U14",
        genGroup: "Coed",
        player_count: 2,
        players: [
          { id: "p19", firstName: "Aiden", lastName: "Morgan", age: 13, position: "Forward", gender: "Male" },
          { id: "p20", firstName: "Harper", lastName: "Bailey", age: 13, position: "Goalkeeper", gender: "Female" }
        ],
        owner: {
          id: '123456789',
          first: "Liam",
          last: "West",
          email: "liam.west@example.com", 
          password: "test1234" 
        },
        managers: [{
          id: '123456789',
          first: "Liam",
          last: "West",
          email: "liam.west@example.com", 
          password: "test1234" 
        }],
        scorekeepers: [],
        colors: {
          home: "#FFD700",
          away: "#00008B"
        }
      },
      {
        id: "team-010",
        name: "Neon Rhinos",
        abbrev: "NRH",
        ageGroup: "U12",
        genGroup: "Male",
        player_count: 2,
        players: [
          { id: "p21", firstName: "Carter", lastName: "Reed", age: 11, position: "Forward", gender: "Male" },
          { id: "p22", firstName: "Owen", lastName: "Young", age: 12, position: "Defender", gender: "Male" }
        ],
        owner: {
          id: '123456789',
          first: "Liam",
          last: "West",
          email: "liam.west@example.com",
          password: "test1234" 
        },
        managers: [{
          id: '123456789',
          first: "Liam",
          last: "West",
          email: "liam.west@example.com", 
          password: "test1234" 
        }],
        scorekeepers: [],
        colors: {
          home: "#39FF14",
          away: "#2F4F4F"
        }
      },
      {
        id: "team-011",
        name: "Midnight Foxes",
        abbrev: "MFX",
        ageGroup: "U18",
        genGroup: "Female",
        player_count: 2,
        players: [
          { id: "p23", firstName: "Stella", lastName: "Brooks", age: 17, position: "Midfielder", gender: "Female" },
          { id: "p24", firstName: "Claire", lastName: "Hill", age: 18, position: "Goalkeeper", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
          password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#191970",
          away: "#F8F8FF"
        }
      },
      {
        id: "team-012",
        name: "Crimson Titans",
        abbrev: "CTN",
        ageGroup: "Adult",
        genGroup: "Coed",
        player_count: 2,
        players: [
          { id: "p25", firstName: "Jack", lastName: "Watson", age: 24, position: "Midfielder", gender: "Male" },
          { id: "p26", firstName: "Samantha", lastName: "Perry", age: 23, position: "Forward", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#8B0000",
          away: "#F5F5DC"
        }
      },
      {
        id: "team-013",
        name: "Frost Falcons",
        abbrev: "FFL",
        ageGroup: "U16",
        genGroup: "Male",
        player_count: 2,
        players: [
          { id: "p27", firstName: "Henry", lastName: "Bennett", age: 15, position: "Forward", gender: "Male" },
          { id: "p28", firstName: "Julian", lastName: "Peterson", age: 15, position: "Defender", gender: "Male" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#00CED1",
          away: "#E6E6FA"
        }
      },
      {
        id: "team-014",
        name: "Solar Cobras",
        abbrev: "SCB",
        ageGroup: "U14",
        genGroup: "Female",
        player_count: 2,
        players: [
          { id: "p29", firstName: "Victoria", lastName: "Foster", age: 14, position: "Midfielder", gender: "Female" },
          { id: "p30", firstName: "Brooklyn", lastName: "Allen", age: 13, position: "Defender", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#FFA500",
          away: "#483D8B"
        }
      },
      {
        id: "team-015",
        name: "Phantom Blades",
        abbrev: "PHB",
        ageGroup: "U18",
        genGroup: "Coed",
        player_count: 2,
        players: [
          { id: "p31", firstName: "Logan", lastName: "Gray", age: 17, position: "Goalkeeper", gender: "Male" },
          { id: "p32", firstName: "Ariana", lastName: "James", age: 16, position: "Forward", gender: "Female" }
        ],
        owner: {
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
},
        managers: [{
  id: '123456789',
  first: "Liam",
  last: "West",
  email: "liam.west@example.com", 
  password: "test1234" 
}],
        scorekeepers: [],
        colors: {
          home: "#2C2C2C",
          away: "#B0E0E6"
        }
      }
    ];
  