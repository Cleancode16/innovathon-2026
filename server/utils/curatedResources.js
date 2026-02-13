/**
 * Curated, real resource links for each subject.
 * All URLs are verified, well-known educational resources.
 * Videos → real YouTube playlists/channels
 * Practice → real coding/quiz platforms
 * Reading → real textbooks, docs, articles
 * Cheatsheets → real quick-reference content
 */

const CURATED_RESOURCES = {
  dsa: {
    videoResources: [
      {
        title: 'Strivers A2Z DSA Course',
        channel: 'take U forward (Striver)',
        description: 'Complete DSA course from basics to advanced — covers arrays, linked lists, trees, graphs, DP and more with company-wise problems.',
        url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
        duration: '200+ videos',
        level: 'beginner'
      },
      {
        title: 'Algorithms Full Course',
        channel: 'Abdul Bari',
        description: 'In-depth algorithms course covering sorting, searching, greedy, dynamic programming, backtracking and graph algorithms with clear whiteboard explanations.',
        url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
        duration: '80+ videos',
        level: 'intermediate'
      },
      {
        title: 'DSA Java Full Course',
        channel: 'Kunal Kushwaha',
        description: 'Complete data structures and algorithms course in Java — great for beginners starting from scratch.',
        url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
        duration: '100+ videos',
        level: 'beginner'
      },
      {
        title: 'Data Structures Full Course',
        channel: 'freeCodeCamp',
        description: 'Comprehensive 8-hour course on data structures — arrays, stacks, queues, trees, heaps, hash tables and graphs.',
        url: 'https://www.youtube.com/watch?v=8hly31xKli0',
        duration: '8 hrs',
        level: 'beginner'
      },
      {
        title: 'NeetCode 150 — LeetCode Solutions',
        channel: 'NeetCode',
        description: 'Curated 150 must-do LeetCode problems with video explanations — ideal for interview prep.',
        url: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
        duration: '150 videos',
        level: 'intermediate'
      },
      {
        title: 'Dynamic Programming Playlist',
        channel: 'Aditya Verma',
        description: 'Best DP playlist on YouTube — covers recursion, memoisation, tabulation with patterns like knapsack, LCS, MCM, and more.',
        url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go',
        duration: '50+ videos',
        level: 'advanced'
      }
    ],
    practiceResources: [
      {
        title: "Striver's SDE Sheet",
        type: 'problem-list',
        description: 'Curated 191 problems covering all DSA topics — a gold standard for placement and interview preparation.',
        url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
        focus: 'Interview preparation'
      },
      {
        title: 'LeetCode',
        type: 'platform',
        description: 'Industry-standard coding practice platform with 2500+ problems, contests, and company-tagged questions.',
        url: 'https://leetcode.com/problemset/',
        focus: 'Problem solving & interviews'
      },
      {
        title: 'GeeksforGeeks DSA',
        type: 'website',
        description: 'Topic-wise DSA articles, problems, and tutorials with solutions in multiple languages.',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        focus: 'Concept clarity & practice'
      },
      {
        title: 'HackerRank Data Structures',
        type: 'platform',
        description: 'Structured topic-wise challenges for arrays, linked lists, trees, stacks, queues and more.',
        url: 'https://www.hackerrank.com/domains/data-structures',
        focus: 'Beginner-friendly practice'
      },
      {
        title: 'Codeforces',
        type: 'platform',
        description: 'Competitive programming platform with regular contests — great for sharpening problem-solving speed.',
        url: 'https://codeforces.com/problemset',
        focus: 'Competitive programming'
      }
    ],
    readingMaterials: [
      {
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Cormen, Leiserson, Rivest & Stein',
        type: 'textbook',
        description: 'The bible of algorithms — covers all standard algorithms with rigorous mathematical proofs.',
        url: '',
        chapters: 'Start with Chapters 1-4 (Foundations), then 6-12 (Sorting & DS), 15-16 (Greedy/DP), 22-26 (Graphs)'
      },
      {
        title: 'Competitive Programming 3',
        author: 'Steven Halim & Felix Halim',
        type: 'textbook',
        description: 'Practical guide to competitive programming with problems categorized by technique.',
        url: 'https://cpbook.net/',
        chapters: 'Ch 2: Data Structures, Ch 3: Problem Solving Paradigms, Ch 4: Graph'
      },
      {
        title: 'Visualgo — Visualising Algorithms',
        author: 'National University of Singapore',
        type: 'interactive',
        description: 'Interactive visualisation tool for data structures and algorithms — see sorting, trees, graphs animate step by step.',
        url: 'https://visualgo.net/en',
        chapters: 'All topics with interactive animations'
      },
      {
        title: 'GeeksforGeeks DSA Tutorial',
        author: 'GeeksforGeeks',
        type: 'documentation',
        description: 'Comprehensive topic-wise DSA tutorial with examples, code, and complexity analysis.',
        url: 'https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/',
        chapters: 'Arrays → Linked List → Stack → Queue → Tree → Graph → DP'
      }
    ],
    cheatSheet: {
      title: 'DSA Quick Reference',
      sections: [
        {
          heading: 'Time Complexity (Big-O)',
          items: [
            'O(1) — Constant: Hash table lookup, array access by index',
            'O(log n) — Logarithmic: Binary search, balanced BST operations',
            'O(n) — Linear: Linear search, single loop through array',
            'O(n log n) — Linearithmic: Merge sort, heap sort, quicksort (average)',
            'O(n²) — Quadratic: Bubble sort, selection sort, insertion sort',
            'O(2ⁿ) — Exponential: Recursive Fibonacci, subsets generation'
          ]
        },
        {
          heading: 'Array & String Patterns',
          items: [
            'Two Pointers: Used for sorted arrays, pair sum, palindrome check',
            'Sliding Window: Subarray/substring problems with fixed/variable window',
            'Prefix Sum: Range sum queries in O(1) after O(n) preprocessing',
            'Kadane\'s Algorithm: Maximum subarray sum in O(n)',
            'Dutch National Flag: 3-way partition (sort 0s, 1s, 2s)'
          ]
        },
        {
          heading: 'Tree & Graph Essentials',
          items: [
            'BFS (Level Order): Queue-based, shortest path in unweighted graph',
            'DFS (Pre/In/Post): Stack/recursion-based, topological sort, cycle detection',
            'Dijkstra: Shortest path in weighted graph (no negative edges)',
            'Binary Search Tree: Inorder traversal gives sorted order',
            'Trie: Efficient prefix-based string searching'
          ]
        },
        {
          heading: 'Dynamic Programming Patterns',
          items: [
            '0/1 Knapsack: Include/exclude items to maximise value within weight',
            'LCS (Longest Common Subsequence): Compare two strings character by character',
            'LIS (Longest Increasing Subsequence): O(n log n) with patience sorting',
            'Matrix Chain Multiplication: Optimal order of operations',
            'Fibonacci Pattern: dp[i] = dp[i-1] + dp[i-2] (climbing stairs, house robber)'
          ]
        },
        {
          heading: 'Data Structure Operations',
          items: [
            'Array: Access O(1), Search O(n), Insert/Delete O(n)',
            'Linked List: Access O(n), Insert/Delete at head O(1)',
            'Stack/Queue: Push/Pop/Enqueue/Dequeue O(1)',
            'Hash Map: Insert/Delete/Search O(1) average, O(n) worst',
            'Heap: Insert O(log n), Extract-Min/Max O(log n), Peek O(1)',
            'BST: Insert/Delete/Search O(log n) average, O(n) worst (skewed)'
          ]
        }
      ]
    }
  },

  os: {
    videoResources: [
      {
        title: 'Operating System Complete Course',
        channel: 'Gate Smashers',
        description: 'Most popular OS playlist for GATE & university exams — covers processes, threads, scheduling, memory management, deadlocks, file systems.',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
        duration: '100+ videos',
        level: 'beginner'
      },
      {
        title: 'Operating Systems Full Course',
        channel: 'Neso Academy',
        description: 'Well-structured OS course with clear animations — great for building strong fundamentals.',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAdc0cPiS',
        duration: '80+ videos',
        level: 'beginner'
      },
      {
        title: "Jenny's OS Lectures",
        channel: "Jenny's Lectures CS IT",
        description: 'Detailed OS lectures covering scheduling algorithms, page replacement, disk scheduling with solved numericals.',
        url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31a5ucW_S1K3-x6ztBRD-PNa',
        duration: '70+ videos',
        level: 'intermediate'
      },
      {
        title: 'Operating System by Knowledge Gate',
        channel: 'Knowledge Gate',
        description: 'Concise OS lectures focused on GATE preparation with previous year questions and short tricks.',
        url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesR1rSES7oLdJaNFgmujD5rB',
        duration: '60+ videos',
        level: 'intermediate'
      },
      {
        title: 'OS Concepts — UC Berkeley CS162',
        channel: 'UC Berkeley',
        description: 'University-level operating systems course from Berkeley — covers advanced OS design concepts.',
        url: 'https://www.youtube.com/playlist?list=PLF2K2xZjNEf97A_uBCwEl61sdxWVP7VWC',
        duration: '40+ lectures',
        level: 'advanced'
      }
    ],
    practiceResources: [
      {
        title: 'GeeksforGeeks — Operating Systems',
        type: 'website',
        description: 'Topic-wise OS articles, quizzes, and practice questions covering all major concepts.',
        url: 'https://www.geeksforgeeks.org/operating-systems/',
        focus: 'Concept clarity & quizzes'
      },
      {
        title: 'Javatpoint — OS Tutorial',
        type: 'website',
        description: 'Step-by-step OS tutorial with diagrams for scheduling, memory management, deadlocks and more.',
        url: 'https://www.javatpoint.com/os-tutorial',
        focus: 'Theory & diagrams'
      },
      {
        title: 'Gate Overflow — OS Questions',
        type: 'platform',
        description: 'GATE previous year questions on OS with detailed solutions and community discussions.',
        url: 'https://gateoverflow.in/tag/operating-system',
        focus: 'Exam-level practice'
      },
      {
        title: 'Tutorialspoint — OS',
        type: 'website',
        description: 'Quick OS reference with examples on process management, synchronisation, and file systems.',
        url: 'https://www.tutorialspoint.com/operating_system/',
        focus: 'Quick revision'
      }
    ],
    readingMaterials: [
      {
        title: 'Operating System Concepts (Silberschatz, Galvin & Gagne)',
        author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
        type: 'textbook',
        description: 'The "Dinosaur Book" — the most widely used OS textbook in universities worldwide.',
        url: '',
        chapters: 'Ch 1-2: Introduction, Ch 3-5: Processes & Scheduling, Ch 7: Deadlocks, Ch 8-9: Memory, Ch 11-12: File & I/O'
      },
      {
        title: 'Modern Operating Systems',
        author: 'Andrew S. Tanenbaum',
        type: 'textbook',
        description: 'Excellent coverage of OS design with real-world case studies on Linux, Windows & Android.',
        url: '',
        chapters: 'Ch 2: Processes, Ch 3: Memory, Ch 4: File Systems, Ch 5: I/O'
      },
      {
        title: 'Operating Systems: Three Easy Pieces (OSTEP)',
        author: 'Remzi & Andrea Arpaci-Dusseau',
        type: 'free-online',
        description: 'Free online OS textbook—easy to read with a focus on virtualisation, concurrency, and persistence.',
        url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
        chapters: 'Virtualisation (Chapters 4-24), Concurrency (Chapters 25-34), Persistence (Chapters 35-44)'
      },
      {
        title: 'GeeksforGeeks — Last Minute OS Notes',
        author: 'GeeksforGeeks',
        type: 'article',
        description: 'Quick revision notes covering all OS topics in concise format for exam preparation.',
        url: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        chapters: 'All topics in one page'
      }
    ],
    cheatSheet: {
      title: 'Operating System Quick Reference',
      sections: [
        {
          heading: 'CPU Scheduling Algorithms',
          items: [
            'FCFS: Non-preemptive, processes run in arrival order — suffers convoy effect',
            'SJF: Shortest Job First — optimal avg waiting time, but starvation possible',
            'SRTF: Preemptive SJF — shortest remaining time selected at each preemption',
            'Round Robin: Time quantum based, preemptive — good for time-sharing systems',
            'Priority Scheduling: Higher priority runs first — solve starvation with aging',
            'MLQ/MLFQ: Multi-level (feedback) queue — different queues for different process types'
          ]
        },
        {
          heading: 'Process Synchronisation',
          items: [
            'Critical Section: Only one process at a time — Mutual Exclusion, Progress, Bounded Wait',
            'Semaphore: wait(s)/signal(s) — Binary (mutex) or Counting semaphore',
            'Mutex: Ownership-based lock — only the locker can unlock',
            'Deadlock Conditions (all 4 needed): Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
            'Banker\'s Algorithm: Deadlock avoidance — checks safe state before allocation'
          ]
        },
        {
          heading: 'Memory Management',
          items: [
            'Paging: Fixed-size pages → frames, no external fragmentation, has internal frag',
            'Segmentation: Variable-size segments, logical division, has external fragmentation',
            'Virtual Memory: Pages loaded on demand — uses page table + TLB',
            'Page Replacement: FIFO, LRU (optimal approx), Optimal (Belady\'s — theoretical)',
            'Belady\'s Anomaly: More frames → more page faults (only in FIFO)'
          ]
        },
        {
          heading: 'Disk Scheduling',
          items: [
            'FCFS: Simple, but high seek time',
            'SSTF: Shortest Seek Time First — better but can cause starvation',
            'SCAN (Elevator): Moves in one direction, then reverses',
            'C-SCAN: Circular SCAN — treats disk as circular, more uniform wait time',
            'LOOK/C-LOOK: Like SCAN/C-SCAN but doesn\'t go to end if no requests'
          ]
        }
      ]
    }
  },

  cn: {
    videoResources: [
      {
        title: 'Computer Networks Complete Course',
        channel: 'Gate Smashers',
        description: 'Most popular CN playlist — covers OSI model, TCP/IP, subnetting, routing, protocols with exam-focused approach.',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
        duration: '100+ videos',
        level: 'beginner'
      },
      {
        title: 'Computer Networks',
        channel: 'Neso Academy',
        description: 'Well-explained CN course with animations for protocol understanding, error detection, and network layers.',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
        duration: '80+ videos',
        level: 'beginner'
      },
      {
        title: 'Computer Networking Full Course',
        channel: 'Kunal Kushwaha',
        description: 'One-shot computer networking course covering all essentials for placements and interviews.',
        url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
        duration: '5 hrs',
        level: 'beginner'
      },
      {
        title: 'Computer Networks by Knowledge Gate',
        channel: 'Knowledge Gate',
        description: 'GATE-focused CN lectures with numerical problems on subnetting, flow/error control, and routing.',
        url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesSjFbXSZGF8JF_4LVwwofCd',
        duration: '60+ videos',
        level: 'intermediate'
      },
      {
        title: 'Computer Networking — Stanford CS144',
        channel: 'Stanford Online',
        description: 'University-level networking course from Stanford — deep dive into internet architecture and protocols.',
        url: 'https://www.youtube.com/playlist?list=PLoCMsyE1cvdWKsLVyf6cPwCLDIZnOj0NS',
        duration: '30+ lectures',
        level: 'advanced'
      }
    ],
    practiceResources: [
      {
        title: 'GeeksforGeeks — Computer Networks',
        type: 'website',
        description: 'Comprehensive CN articles, quizzes, and previous year questions organised topic-wise.',
        url: 'https://www.geeksforgeeks.org/computer-network-tutorials/',
        focus: 'Theory & quizzes'
      },
      {
        title: 'Javatpoint — Computer Network Tutorial',
        type: 'website',
        description: 'Step-by-step CN tutorials with diagrams for all layers, protocols, and subnetting.',
        url: 'https://www.javatpoint.com/computer-network-tutorial',
        focus: 'Concept understanding'
      },
      {
        title: 'Gate Overflow — CN Questions',
        type: 'platform',
        description: 'GATE previous year questions on Computer Networks with community-verified solutions.',
        url: 'https://gateoverflow.in/tag/computer-networks',
        focus: 'Exam-level practice'
      },
      {
        title: 'Subnet Calculator & Practice',
        type: 'tool',
        description: 'Interactive subnetting practice tool — essential for mastering IP addressing and subnetting.',
        url: 'https://subnetipv4.com/',
        focus: 'Subnetting practice'
      }
    ],
    readingMaterials: [
      {
        title: 'Computer Networking: A Top-Down Approach',
        author: 'James Kurose & Keith Ross',
        type: 'textbook',
        description: 'The gold standard CN textbook — explains networking from application layer down to physical layer.',
        url: '',
        chapters: 'Ch 1: Introduction, Ch 2: Application Layer, Ch 3: Transport, Ch 4: Network, Ch 5: Link, Ch 6: Wireless'
      },
      {
        title: 'Data Communications and Networking',
        author: 'Behrouz A. Forouzan',
        type: 'textbook',
        description: 'Comprehensive coverage of data communication fundamentals with excellent diagrams and protocol details.',
        url: '',
        chapters: 'Part 1: Overview, Part 2: Physical Layer, Part 3: Data Link, Part 4: Network, Part 5: Transport'
      },
      {
        title: 'Computer Networks',
        author: 'Andrew S. Tanenbaum',
        type: 'textbook',
        description: 'Classic networking textbook with thorough coverage of protocols, architecture, and network security.',
        url: '',
        chapters: 'Ch 1: Physical, Ch 3: Data Link, Ch 4: MAC, Ch 5: Network, Ch 6: Transport, Ch 7: Application'
      },
      {
        title: 'GeeksforGeeks — Last Minute CN Notes',
        author: 'GeeksforGeeks',
        type: 'article',
        description: 'Quick revision notes covering all CN topics — OSI, TCP/IP, protocols, subnetting in concise format.',
        url: 'https://www.geeksforgeeks.org/last-minute-notes-computer-network/',
        chapters: 'All topics in one page'
      }
    ],
    cheatSheet: {
      title: 'Computer Networks Quick Reference',
      sections: [
        {
          heading: 'OSI Model (7 Layers)',
          items: [
            'Layer 7 — Application: HTTP, FTP, SMTP, DNS, DHCP (user interaction)',
            'Layer 6 — Presentation: Encryption, Compression, Data format translation',
            'Layer 5 — Session: Session management, authentication, synchronisation',
            'Layer 4 — Transport: TCP (reliable, connection-oriented), UDP (fast, connectionless)',
            'Layer 3 — Network: IP addressing, routing (RIP, OSPF, BGP), ICMP',
            'Layer 2 — Data Link: MAC addressing, framing, error detection (CRC), ARP',
            'Layer 1 — Physical: Bits on wire, hubs, cables, signal encoding'
          ]
        },
        {
          heading: 'TCP vs UDP',
          items: [
            'TCP: Connection-oriented, reliable, ordered, flow & congestion control, 3-way handshake',
            'UDP: Connectionless, unreliable, no ordering, faster, used for streaming/DNS/gaming',
            'TCP Header: 20 bytes min — Source/Dest port, Seq#, Ack#, Flags, Window size',
            'UDP Header: 8 bytes — Source/Dest port, Length, Checksum',
            'TCP Congestion Control: Slow Start → Congestion Avoidance → Fast Retransmit → Fast Recovery'
          ]
        },
        {
          heading: 'IP Addressing & Subnetting',
          items: [
            'IPv4: 32-bit, dotted decimal (e.g., 192.168.1.1), 5 classes (A-E)',
            'Class A: 1.0.0.0 – 126.x.x.x (/8), Class B: 128.0.0.0 – 191.x.x.x (/16), Class C: 192.0.0.0 – 223.x.x.x (/24)',
            'Subnet Mask: Determines network vs host portion — e.g., /24 = 255.255.255.0',
            'Hosts per subnet: 2^(host bits) - 2 (subtract network & broadcast)',
            'Private IPs: 10.x.x.x, 172.16-31.x.x, 192.168.x.x'
          ]
        },
        {
          heading: 'Key Protocols',
          items: [
            'HTTP/HTTPS: Web traffic (port 80/443), HTTPS = HTTP + TLS encryption',
            'DNS: Domain → IP resolution (port 53), uses UDP (queries) + TCP (zone transfer)',
            'DHCP: Automatic IP assignment — DORA (Discover, Offer, Request, Acknowledge)',
            'ARP: IP → MAC resolution (broadcast), RARP: MAC → IP',
            'ICMP: Diagnostic protocol — ping (echo request/reply), traceroute'
          ]
        }
      ]
    }
  },

  dbms: {
    videoResources: [
      {
        title: 'DBMS Complete Course',
        channel: 'Gate Smashers',
        description: 'Comprehensive DBMS playlist covering ER model, normalisation, SQL, transactions, concurrency, indexing.',
        url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y',
        duration: '90+ videos',
        level: 'beginner'
      },
      {
        title: 'DBMS Full Course',
        channel: "Jenny's Lectures CS IT",
        description: 'Detailed DBMS lectures with solved examples — SQL queries, normalisation, relational algebra, transactions.',
        url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31b33kF46f9aFjoJPOkdlsRc',
        duration: '80+ videos',
        level: 'beginner'
      },
      {
        title: 'DBMS — Neso Academy',
        channel: 'Neso Academy',
        description: 'Well-structured DBMS course with clear explanations on relational model, functional dependencies and normalisation.',
        url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXMhEK3BQH4Lsb5e',
        duration: '60+ videos',
        level: 'beginner'
      },
      {
        title: 'SQL Full Course',
        channel: 'freeCodeCamp',
        description: 'Complete SQL tutorial for beginners — covers MySQL with hands-on examples and practice.',
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        duration: '4.5 hrs',
        level: 'beginner'
      },
      {
        title: 'Database Systems — CMU 15-445',
        channel: 'CMU Database Group',
        description: 'Advanced database internals course from CMU Prof. Andy Pavlo — storage, indexing, query processing, transactions.',
        url: 'https://www.youtube.com/playlist?list=PLSE8ODhjZXjaKScG3l0nuOiDTTqpfnWFf',
        duration: '25+ lectures',
        level: 'advanced'
      }
    ],
    practiceResources: [
      {
        title: 'HackerRank SQL',
        type: 'platform',
        description: 'SQL practice challenges from basic SELECT to advanced JOINs, subqueries and aggregations.',
        url: 'https://www.hackerrank.com/domains/sql',
        focus: 'SQL query practice'
      },
      {
        title: 'LeetCode SQL 50',
        type: 'platform',
        description: 'Curated 50 SQL problems covering SELECT, JOINs, subqueries, window functions — interview focused.',
        url: 'https://leetcode.com/studyplan/top-sql-50/',
        focus: 'Interview SQL problems'
      },
      {
        title: 'SQLZoo',
        type: 'interactive',
        description: 'Free interactive SQL tutorial with a built-in editor — learn by writing queries against live databases.',
        url: 'https://sqlzoo.net/',
        focus: 'Hands-on SQL learning'
      },
      {
        title: 'W3Schools SQL Tutorial',
        type: 'website',
        description: 'Beginner-friendly SQL tutorial with Try-It-Yourself editor — covers all SQL syntax and functions.',
        url: 'https://www.w3schools.com/sql/',
        focus: 'SQL basics & syntax'
      },
      {
        title: 'GeeksforGeeks — DBMS',
        type: 'website',
        description: 'Complete DBMS articles, quizzes, and GATE questions on normalisation, transactions, and relational algebra.',
        url: 'https://www.geeksforgeeks.org/dbms/',
        focus: 'Theory & exam practice'
      }
    ],
    readingMaterials: [
      {
        title: 'Database System Concepts',
        author: 'Silberschatz, Korth & Sudarshan',
        type: 'textbook',
        description: 'The most widely used DBMS textbook — covers relational model, SQL, normalisation, transactions, and indexing.',
        url: '',
        chapters: 'Ch 1-2: Introduction, Ch 3-5: SQL, Ch 6-7: ER & Normalisation, Ch 14-16: Transactions & Concurrency'
      },
      {
        title: 'Fundamentals of Database Systems',
        author: 'Ramez Elmasri & Shamkant B. Navathe',
        type: 'textbook',
        description: 'Comprehensive DBMS textbook with detailed coverage of ER modelling, NoSQL, and distributed databases.',
        url: '',
        chapters: 'Part 1: ER Modelling, Part 2: Relational Model & SQL, Part 3: Normalisation, Part 5: Transactions'
      },
      {
        title: 'Use The Index, Luke',
        author: 'Markus Winand',
        type: 'free-online',
        description: 'Free online book about SQL indexing and performance — learn how databases use indexes internally.',
        url: 'https://use-the-index-luke.com/',
        chapters: 'Anatomy of an Index, Where Clause, Join, Sorting & Grouping'
      },
      {
        title: 'GeeksforGeeks — Last Minute DBMS Notes',
        author: 'GeeksforGeeks',
        type: 'article',
        description: 'Quick revision notes for all DBMS topics — normalisation forms, ACID properties, SQL commands at a glance.',
        url: 'https://www.geeksforgeeks.org/last-minute-notes-dbms/',
        chapters: 'All topics in one page'
      }
    ],
    cheatSheet: {
      title: 'DBMS Quick Reference',
      sections: [
        {
          heading: 'Normal Forms',
          items: [
            '1NF: Atomic values only — no multi-valued or composite attributes in columns',
            '2NF: 1NF + No partial dependency (non-key depends on part of candidate key)',
            '3NF: 2NF + No transitive dependency (non-key depends on another non-key)',
            'BCNF: For every FD X→Y, X must be a superkey (stricter than 3NF)',
            '4NF: BCNF + No multi-valued dependencies',
            'Lossless Join & Dependency Preservation are tested during decomposition'
          ]
        },
        {
          heading: 'ACID Properties',
          items: [
            'Atomicity: Transaction is all-or-nothing (managed by recovery system)',
            'Consistency: DB moves from one valid state to another',
            'Isolation: Concurrent transactions don\'t interfere (managed by concurrency control)',
            'Durability: Committed changes survive system crashes (managed by log/WAL)'
          ]
        },
        {
          heading: 'SQL Commands',
          items: [
            'DDL: CREATE, ALTER, DROP, TRUNCATE (schema definition)',
            'DML: SELECT, INSERT, UPDATE, DELETE (data manipulation)',
            'DCL: GRANT, REVOKE (access control)',
            'TCL: COMMIT, ROLLBACK, SAVEPOINT (transaction control)',
            'Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, NATURAL'
          ]
        },
        {
          heading: 'Concurrency Control',
          items: [
            'Lock-Based: Shared (read), Exclusive (write), 2-Phase Locking (2PL)',
            'Timestamp Ordering: Transactions ordered by timestamps, no locks needed',
            'MVCC: Multiple versions of data — readers don\'t block writers',
            'Dirty Read: Reading uncommitted data | Phantom Read: New rows appear in range',
            'Isolation Levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable'
          ]
        }
      ]
    }
  },

  oops: {
    videoResources: [
      {
        title: 'Java OOP Concepts',
        channel: 'Kunal Kushwaha',
        description: 'Comprehensive OOP in Java — covers classes, objects, inheritance, polymorphism, abstraction, encapsulation with coding examples.',
        url: 'https://www.youtube.com/watch?v=BSVKUk58K6U',
        duration: '3 hrs',
        level: 'beginner'
      },
      {
        title: 'OOP in C++ Full Course',
        channel: 'CodeWithHarry',
        description: 'Complete OOP course in C++ — covers all 4 pillars with real-world examples and projects.',
        url: 'https://www.youtube.com/watch?v=i_5pvt7ag7E',
        duration: '2 hrs',
        level: 'beginner'
      },
      {
        title: 'Java OOP Full Course',
        channel: 'Apna College',
        description: 'Java OOP series from basics to advanced — constructors, static, abstract classes, interfaces, packages.',
        url: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop',
        duration: '30+ videos',
        level: 'beginner'
      },
      {
        title: 'Object Oriented Programming — MIT 6.01',
        channel: 'MIT OpenCourseWare',
        description: 'University-level OOP concepts from MIT — object-oriented design principles and patterns.',
        url: 'https://www.youtube.com/watch?v=nykOeWgQcHM&list=PLUl4u3cNGP63WbdFxL8giv4yhgdMGaZNA',
        duration: '20+ lectures',
        level: 'advanced'
      },
      {
        title: 'Design Patterns in Object Oriented Programming',
        channel: 'Christopher Okhravi',
        description: 'Excellent explanations of Gang of Four design patterns — Strategy, Observer, Decorator, Factory, Singleton and more.',
        url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc',
        duration: '25+ videos',
        level: 'advanced'
      }
    ],
    practiceResources: [
      {
        title: 'GeeksforGeeks — OOP Concepts',
        type: 'website',
        description: 'Topic-wise OOP articles in Java/C++/Python with examples, quizzes, and interview questions.',
        url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/',
        focus: 'Concept clarity'
      },
      {
        title: 'HackerRank — Java OOP',
        type: 'platform',
        description: 'Hands-on OOP challenges in Java — classes, inheritance, interfaces, abstract classes.',
        url: 'https://www.hackerrank.com/domains/java',
        focus: 'Coding practice'
      },
      {
        title: 'Exercism — OOP Track',
        type: 'platform',
        description: 'Mentored coding exercises for OOP in multiple languages — get feedback from real developers.',
        url: 'https://exercism.org/tracks/java/concepts/classes',
        focus: 'Mentored learning'
      },
      {
        title: 'Refactoring Guru — Design Patterns',
        type: 'website',
        description: 'Visual guide to all 23 GoF design patterns with code examples in Java, C++, Python, TypeScript.',
        url: 'https://refactoring.guru/design-patterns',
        focus: 'Design patterns mastery'
      }
    ],
    readingMaterials: [
      {
        title: 'Head First Object-Oriented Analysis & Design',
        author: "Brett McLaughlin, Gary Pollice & David West",
        type: 'textbook',
        description: 'Beginner-friendly OOP book with visual learning approach — covers design principles through real examples.',
        url: '',
        chapters: 'Ch 1-3: OOP Basics, Ch 4-6: Design Principles, Ch 7-9: Real Applications'
      },
      {
        title: 'Head First Design Patterns',
        author: 'Eric Freeman & Elisabeth Robson',
        type: 'textbook',
        description: 'The most approachable design patterns book — learn patterns through visual, engaging examples.',
        url: '',
        chapters: 'Strategy, Observer, Decorator, Factory, Singleton, Command, Adapter, Template, Iterator, State, Proxy'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        type: 'textbook',
        description: 'Learn to write clean, maintainable OOP code — naming conventions, functions, classes, SOLID principles.',
        url: '',
        chapters: 'Ch 2: Meaningful Names, Ch 3: Functions, Ch 6: Objects & Data, Ch 10: Classes, Ch 11: Systems'
      },
      {
        title: 'Refactoring Guru — SOLID Principles',
        author: 'Alexander Shvets',
        type: 'free-online',
        description: 'Visual explanation of SOLID principles with before/after code examples in multiple languages.',
        url: 'https://refactoring.guru/refactoring',
        chapters: 'SRP, OCP, LSP, ISP, DIP with code examples'
      }
    ],
    cheatSheet: {
      title: 'OOP Concepts Quick Reference',
      sections: [
        {
          heading: 'Four Pillars of OOP',
          items: [
            'Encapsulation: Bundling data + methods together, hide internals using access modifiers (private/protected/public)',
            'Abstraction: Show only essential features, hide implementation — achieved via abstract classes & interfaces',
            'Inheritance: Child class inherits parent\'s properties/methods — supports code reuse (extends/implements)',
            'Polymorphism: Same interface, different implementations — Compile-time (overloading) & Runtime (overriding)'
          ]
        },
        {
          heading: 'SOLID Principles',
          items: [
            'S — Single Responsibility: A class should have only one reason to change',
            'O — Open/Closed: Open for extension, closed for modification',
            'L — Liskov Substitution: Subtypes must be substitutable for their base types',
            'I — Interface Segregation: Many specific interfaces > one general interface',
            'D — Dependency Inversion: Depend on abstractions, not concretions'
          ]
        },
        {
          heading: 'Key Concepts',
          items: [
            'Constructor: Special method called during object creation — default, parameterised, copy',
            'this keyword: Reference to current object instance',
            'super keyword: Reference to parent class — super() calls parent constructor',
            'static: Belongs to class, not instance — shared across all objects',
            'final: Cannot be overridden (method), inherited (class), or reassigned (variable)',
            'Abstract class: Cannot be instantiated, can have both abstract & concrete methods'
          ]
        },
        {
          heading: 'Common Design Patterns',
          items: [
            'Singleton: One instance globally — private constructor + static getInstance()',
            'Factory: Create objects without exposing creation logic — use interface, return subclass',
            'Observer: One-to-many dependency — subject notifies observers on state change',
            'Strategy: Define family of algorithms, make them interchangeable at runtime',
            'Decorator: Add behaviour dynamically without modifying original class'
          ]
        }
      ]
    }
  },

  qa: {
    videoResources: [
      {
        title: 'Aptitude Full Course',
        channel: 'CareerRide',
        description: 'Complete quantitative aptitude course covering time & work, profit & loss, percentages, ratios, permutations with shortcuts.',
        url: 'https://www.youtube.com/playlist?list=PLjLhUHPsqNYkcq6YOfiywbQ54yPFkvHkj',
        duration: '100+ videos',
        level: 'beginner'
      },
      {
        title: 'Quantitative Aptitude for Placements',
        channel: 'Placement Grid',
        description: 'Placement-focused aptitude tutorials — percentages, averages, time-speed-distance, probability with tricks.',
        url: 'https://www.youtube.com/playlist?list=PL7g1jYj15RUPNsVqvExGuNxoWULBk1cPj',
        duration: '50+ videos',
        level: 'beginner'
      },
      {
        title: 'Aptitude Made Easy',
        channel: 'Feel Free to Learn',
        description: 'Short, focused videos on each aptitude topic with tricks and shortcuts for competitive exams.',
        url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt',
        duration: '40+ videos',
        level: 'beginner'
      },
      {
        title: 'Logical Reasoning Complete Course',
        channel: 'Unacademy',
        description: 'Logical reasoning and quantitative aptitude combined course — covers puzzles, coding-decoding, series, and quant.',
        url: 'https://www.youtube.com/playlist?list=PLjLhUHPsqNYnM1DmZhIbtd9wNfGSGU0jf',
        duration: '60+ videos',
        level: 'intermediate'
      },
      {
        title: 'Vedic Math Tricks for Fast Calculation',
        channel: 'Magical Education',
        description: 'Speed math techniques — multiplication tricks, square roots, cube roots for competitive exams.',
        url: 'https://www.youtube.com/playlist?list=PLIBtb_NuIJ1y4bx9guxkg7WN-NXxRrio7',
        duration: '20+ videos',
        level: 'beginner'
      }
    ],
    practiceResources: [
      {
        title: 'IndiaBIX — Aptitude',
        type: 'website',
        description: 'Largest collection of aptitude questions with explanations — topic-wise practice for placements & competitive exams.',
        url: 'https://www.indiabix.com/aptitude/questions-and-answers/',
        focus: 'Comprehensive aptitude practice'
      },
      {
        title: 'PrepInsta — Quantitative Aptitude',
        type: 'website',
        description: 'Company-specific aptitude questions — TCS, Infosys, Wipro, Cognizant patterns with solutions.',
        url: 'https://prepinsta.com/quantitative-aptitude/',
        focus: 'Placement-specific practice'
      },
      {
        title: 'GeeksforGeeks — Aptitude',
        type: 'website',
        description: 'Aptitude questions and puzzles for coding interviews and placement preparation.',
        url: 'https://www.geeksforgeeks.org/aptitude-gq/',
        focus: 'Quant + puzzles'
      },
      {
        title: 'Testbook Free Quant Tests',
        type: 'platform',
        description: 'Free online aptitude mock tests with timer and detailed solutions — simulates exam environment.',
        url: 'https://testbook.com/objective-questions/quantitative-aptitude',
        focus: 'Mock test practice'
      }
    ],
    readingMaterials: [
      {
        title: 'Quantitative Aptitude for Competitive Examinations',
        author: 'R.S. Aggarwal',
        type: 'textbook',
        description: 'The bible of aptitude preparation — covers all topics with thousands of practice questions and shortcuts.',
        url: '',
        chapters: 'Number System, HCF/LCM, Percentages, Profit & Loss, SI/CI, Time & Work, Time & Distance, Probability'
      },
      {
        title: 'How to Prepare for Quantitative Aptitude for the CAT',
        author: 'Arun Sharma',
        type: 'textbook',
        description: 'Excellent for advanced quant preparation — difficulty progresses from basic to CAT-level problems.',
        url: '',
        chapters: 'Number System, Arithmetic, Algebra, Geometry, Counting, DI'
      },
      {
        title: 'Puzzles to Puzzle You',
        author: 'Shakuntala Devi',
        type: 'textbook',
        description: 'Classic puzzle book to develop logical thinking — great for reasoning and interview puzzle rounds.',
        url: '',
        chapters: '150 puzzles covering maths reasoning and lateral thinking'
      },
      {
        title: 'IndiaBIX — Formulas & Shortcuts',
        author: 'IndiaBIX',
        type: 'free-online',
        description: 'Quick formulas and shortcut methods for all aptitude topics — handy reference during preparation.',
        url: 'https://www.indiabix.com/',
        chapters: 'Topic-wise formula sheets'
      }
    ],
    cheatSheet: {
      title: 'Quantitative Aptitude Quick Reference',
      sections: [
        {
          heading: 'Percentage & Profit/Loss',
          items: [
            'Percentage change = (Change / Original) × 100',
            'Profit % = (Profit / CP) × 100 | Loss % = (Loss / CP) × 100',
            'SP = CP × (1 + P%/100) for profit | SP = CP × (1 - L%/100) for loss',
            'Discount % = (Discount / Marked Price) × 100',
            'Two successive discounts a%, b%: Equivalent = a + b - ab/100'
          ]
        },
        {
          heading: 'Time, Speed & Distance',
          items: [
            'Speed = Distance / Time | Distance = Speed × Time',
            'Average Speed (same distance) = 2ab / (a + b) for two speeds a and b',
            'Relative Speed (same direction) = |a - b| | Opposite direction = a + b',
            'Train crossing pole: Time = Length of Train / Speed',
            'Train crossing platform: Time = (Length of Train + Platform) / Speed'
          ]
        },
        {
          heading: 'Time & Work',
          items: [
            'If A does work in x days, A\'s 1 day work = 1/x',
            'A + B together: 1/x + 1/y = (x+y)/xy → Time = xy/(x+y)',
            'Pipes & Cisterns: Inlet fills, Outlet empties — net = fill rate - empty rate',
            'Efficiency = Total Work / Time | Work = Efficiency × Time',
            'If M₁D₁H₁ / W₁ = M₂D₂H₂ / W₂ (Men-Days-Hours formula)'
          ]
        },
        {
          heading: 'Probability & Permutation/Combination',
          items: [
            'P(E) = Favourable outcomes / Total outcomes (0 ≤ P ≤ 1)',
            'P(A or B) = P(A) + P(B) - P(A and B)',
            'P(A and B) = P(A) × P(B) if independent',
            'nPr = n! / (n-r)! — Permutation (order matters)',
            'nCr = n! / (r! × (n-r)!) — Combination (order doesn\'t matter)',
            'nCr = nC(n-r) | nC0 = nCn = 1'
          ]
        },
        {
          heading: 'Simple & Compound Interest',
          items: [
            'SI = PNR / 100 | Amount = P + SI = P(1 + NR/100)',
            'CI Amount = P(1 + R/100)^N | CI = Amount - P',
            'Difference between CI and SI for 2 years = P(R/100)²',
            'If rate = R% and compounded half-yearly: Rate = R/2, Time = 2N',
            'Effective Rate (annual) for half-yearly = (1 + R/200)² - 1'
          ]
        }
      ]
    }
  }
};

module.exports = CURATED_RESOURCES;
