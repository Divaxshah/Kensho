

import random

class CodingChallenges:
    def __init__(self):
        self.questions = {
            "basic": [
                {
                    "id": "basic-1",
                    "title": "Two Sum",
                    "description": "Given an array of integers `nums` and an integer `target`, return a new array containing the indices of the two numbers such that they add up to `target`.",
                    "examples": [
                        "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
                        "Input: nums = [3, 2, 4], target = 6\nOutput: [1, 2]"
                    ],
                    "constraints": [
                        "2 <= nums.length <= 10^4",
                        "-10^9 <= nums[i] <= 10^9",
                        "-10^9 <= target <= 10^9",
                        "Only one valid answer exists."
                    ],
                    "test_cases": [
                        {"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]},
                        {"input": {"nums": [3, 2, 4], "target": 6}, "output": [1, 2]},
                        {"input": {"nums": [3, 3], "target": 6}, "output": [0, 1]},
                        {"input": {"nums": [-1, -3, 5, 9], "target": 4}, "output": [2, 3]}
                    ]
                },
                {
                    "id": "basic-2",
                    "title": "Reverse a String",
                    "description": "Write a function that reverses a string. The input string is given as an array of characters `s`.",
                    "examples": [
                        "Input: s = ['h','e','l','l','o']\nOutput: ['o','l','l','e','h']",
                        "Input: s = ['A',' ','m','a','n']\nOutput: ['n','a','m',' ','A']"
                    ],
                    "constraints": [
                        "1 <= s.length <= 10^5",
                        "s[i] is a printable ascii character."
                    ],
                    "test_cases": [
                        {"input": {"s": ["h","e","l","l","o"]}, "output": ["o","l","l","e","h"]},
                        {"input": {"s": ["A"," ","m","a","n"]}, "output": ["n","a","m"," ","A"]}
                    ]
                }
            ],
            "medium": [
                {
                    "id": "medium-1",
                    "title": "Palindrome Number",
                    "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
                    "examples": [
                        "Input: x = 121\nOutput: true",
                        "Input: x = -121\nOutput: false",
                        "Input: x = 10\nOutput: false"
                    ],
                    "constraints": [
                        "-2^31 <= x <= 2^31 - 1"
                    ],
                    "test_cases": [
                        {"input": {"x": 121}, "output": True},
                        {"input": {"x": -121}, "output": False},
                        {"input": {"x": 10}, "output": False},
                        {"input": {"x": 12321}, "output": True}
                    ]
                },
                {
                    "id": "medium-2",
                    "title": "Longest Common Prefix",
                    "description": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
                    "examples": [
                        "Input: strs = [\"flower\",\"flow\",\"flight\"]\nOutput: \"fl\"",
                        "Input: strs = [\"dog\",\"racecar\",\"car\"]\nOutput: \"\""
                    ],
                    "constraints": [
                        "1 <= strs.length <= 200",
                        "0 <= strs[i].length <= 200",
                        "strs[i] consists of only lower-case English letters."
                    ],
                    "test_cases": [
                        {"input": {"strs": ["flower","flow","flight"]}, "output": "fl"},
                        {"input": {"strs": ["dog","racecar","car"]}, "output": ""},
                        {"input": {"strs": ["apple", "apply", "ape"]}, "output": "ap"},
                        {"input": {"strs": ["", "b"]}, "output": ""}
                    ]
                }
            ],
            "advanced": [
                {
                    "id": "advanced-1",
                    "title": "Valid Parentheses",
                    "description": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
                    "examples": [
                        "Input: s = \"()\"\nOutput: true",
                        "Input: s = \"()[]{\}\"\nOutput: true",
                        "Input: s = \"(]\"\nOutput: false"
                    ],
                    "constraints": [
                        "1 <= s.length <= 10^4",
                        "s consists of parentheses only '()[]{\}'."
                    ],
                    "test_cases": [
                        {"input": {"s": "()"}, "output": True},
                        {"input": {"s": "()[]{}"}, "output": True},
                        {"input": {"s": "(]"}, "output": False},
                        {"input": {"s": "([)]"}, "output": False},
                        {"input": {"s": "{[]}"}, "output": True}
                    ]
                },
                {
                    "id": "advanced-2",
                    "title": "Merge Two Sorted Lists",
                    "description": "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
                    "examples": [
                        "Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
                        "Input: list1 = [], list2 = []\nOutput: []",
                        "Input: list1 = [], list2 = [0]\nOutput: [0]"
                    ],
                    "constraints": [
                        "The number of nodes in both lists is in the range [0, 50].",
                        "-100 <= Node.val <= 100",
                        "Both list1 and list2 are sorted in non-decreasing order."
                    ],
                    "test_cases": [
                        {"input": {"list1": [1,2,4], "list2": [1,3,4]}, "output": [1,1,2,3,4,4]},
                        {"input": {"list1": [], "list2": []}, "output": []},
                        {"input": {"list1": [], "list2": [0]}, "output": [0]}
                    ]
                }
            ]
        }

    def get_question(self, difficulty="basic", question_id=None):
        if difficulty not in self.questions:
            return None
        
        if question_id:
            for q in self.questions[difficulty]:
                if q["id"] == question_id:
                    return q
            return None
        
        if not self.questions[difficulty]:
            return None
            
        return random.choice(self.questions[difficulty])

    def get_questions_by_difficulty(self, difficulty="basic"):
        return self.questions.get(difficulty, [])


