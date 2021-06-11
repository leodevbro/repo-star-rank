import React, { useEffect, useState } from "react";

import "./App.scss";

const prettierNumber = (n: number) => {
    const nString = String(n);

    let finalString = "";

    if (nString.length <= 3) {
        finalString = nString;
    } else if (nString.length === 4) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "k";
    } else if ([5, 6].includes(nString.length)) {
        finalString = nString.slice(0, -3) + "k";
    } else if (nString.length === 7) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "m";
    } else if ([8, 9].includes(nString.length)) {
        finalString = nString.slice(0, -6) + "m";
    } else if (nString.length === 10) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "b";
    } else {
        finalString = nString.slice(0, -9) + "b";
    }

    return finalString;
};

// console.log("1 --- ", prettierNumber(1));
// console.log("12 --- ", prettierNumber(12));
// console.log("123 --- ", prettierNumber(123));
// console.log("1234 --- ", prettierNumber(1234));
// console.log("12345 --- ", prettierNumber(12345));
// console.log("123456 --- ", prettierNumber(123456));
// console.log("1234567 --- ", prettierNumber(1234567));
// console.log("12345678 --- ", prettierNumber(12345678));
// console.log("123456789 --- ", prettierNumber(123456789));
// console.log("1234567890 --- ", prettierNumber(1234567890));
// console.log("12345678901 --- ", prettierNumber(12345678901));
// console.log("123456789012 --- ", prettierNumber(123456789012));
// console.log("1234567890123 --- ", prettierNumber(1234567890123));

interface IRepo {
    id: number;
    name: string;
    url: string;
    created_at: string;
    description: string | null;
    stargazers_count: number; // count of stars
    open_issues_count: number; // count of open issues
    owner: {
        id: number;
        avatar_url: string;
        login: string;
    };
}

const SingleRepo: React.FC<{ apiObj: IRepo }> = ({ apiObj }) => {
    let descriptionPreview = "This repo does not have a description";
    if (apiObj.description) {
        descriptionPreview = apiObj.description.slice(0, 50);

        if (apiObj.description !== descriptionPreview) {
            descriptionPreview += "...";
        }
    }

    return (
        <div className={"repoItem"}>
            <div className={"sectionImage"}>
                <img src={`${apiObj.owner.avatar_url}`} alt={"Profile"} />
            </div>
            <div className={"sectionDetails"}>
                <div className={"repoName"}>{apiObj.name}</div>
                <div
                    className={`repoDescription ${
                        apiObj.description ? "hasValue" : "noValue"
                    }`}
                >
                    {descriptionPreview}
                </div>
                <div className={"repoNumbers"}>
                    <div className={"nStars"}>Stars: 118k</div>
                    <div className={"nIssues"}>Issues: 16k</div>
                    <div className={"timeAndAuthor"}>
                        Submited 30 days ago by leodevbro
                    </div>
                </div>
            </div>
        </div>
    );
};

const RepoList = () => {
    const [repoArr, setRepoArr] = useState<IRepo[]>([]);

    const fetchRepos = async () => {
        const data = await fetch(
            `https://api.github.com/search/repositories?q=created:>${"2021-01-02"}&sort=stars&order=desc`
        );

        console.log(data);

        const jsoned = await data.json();

        if (data.status === 200 && jsoned.items) {
            const repoList: IRepo[] = jsoned.items.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    url: item.url,
                    created_at: item.created_at,
                    description: item.description,
                    stargazers_count: item.stargazers_count, // count of stars
                    open_issues_count: item.open_issues_count, // count of open issues
                    owner: {
                        id: item.owner.id,
                        avatar_url: item.owner.avatar_url,
                        login: item.owner.login,
                    },
                };
            });
            setRepoArr(repoList);
        } else {
            alert("Please Refresh");
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    return (
        <div className={"repoListBox"}>
            {repoArr.map((item, i) => {
                return <SingleRepo key={item.id} apiObj={item} />;
            })}
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <RepoList />
        </div>
    );
}

export default App;
