import React, { useEffect, useState, useCallback } from "react";

import "./App.scss";
import { diffInDays, prettierNumber } from "./utils";

import { useBottomScrollListener } from "react-bottom-scroll-listener";

interface IRepo {
    id: number;
    name: string;
    url: string;
    html_url: string;
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
        if (apiObj.description.length > 50) {
            descriptionPreview = apiObj.description.slice(0, 50) + "...";
        } else {
            descriptionPreview = apiObj.description;
        }
    }

    const currDate = new Date();
    const creationDate = new Date(apiObj.created_at);
    const daysAgo = diffInDays(currDate, creationDate);

    return (
        <div className={"repoItem"}>
            <div className={"sectionImage"}>
                <img src={`${apiObj.owner.avatar_url}`} alt={"Profile"} />
            </div>
            <div className={"sectionDetails"}>
                <div className={"repoName"}>
                    <a
                        href={apiObj.html_url}
                        target={"_blank"}
                        rel="noreferrer"
                    >
                        {apiObj.name}
                    </a>
                </div>
                <div
                    className={`repoDescription ${
                        apiObj.description ? "hasValue" : "noValue"
                    }`}
                >
                    {descriptionPreview}
                </div>
                <div className={"repoNumbers"}>
                    <div className={"nStars"}>
                        <strong>Stars:</strong>{" "}
                        {prettierNumber(apiObj.stargazers_count)}
                    </div>
                    <div className={"nOpenIssues"}>
                        <strong>Open Issues:</strong>{" "}
                        {prettierNumber(apiObj.open_issues_count)}
                    </div>
                    <div className={"timeAndAuthor"}>
                        Submited {daysAgo} days ago by {apiObj.owner.login}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RepoList: React.FC = () => {
    const [repoArr, setRepoArr] = useState<IRepo[]>([]);
    const [pageNumber, setPageNumber] = useState(1);

    const myAbortController = new AbortController();

    const fetchRepos = async () => {
        const daysAgo = 30;
        const currDate = new Date();
        const agoTimeInMilliseconds =
            currDate.getTime() - 1000 * 3600 * 24 * daysAgo;
        const agoDate = new Date(agoTimeInMilliseconds);
        const agoDateString = agoDate.toISOString().slice(0, 10);

        const data = await fetch(
            `https://api.github.com/search/repositories?q=created:>${agoDateString}&sort=stars&order=desc&page=${pageNumber}`,
            { signal: myAbortController.signal }
        );

        // console.log(data);

        if (data.status === 200) {
            const jsoned = await data.json();
            if (jsoned.items) {
                const repoList: IRepo[] = jsoned.items.map((item: any) => {
                    return {
                        id: item.id,
                        name: item.name,
                        url: item.url,
                        created_at: item.created_at,
                        description: item.description,
                        stargazers_count: item.stargazers_count, // count of stars
                        open_issues_count: item.open_issues_count, // count of open issues
                        html_url: item.html_url,
                        owner: {
                            id: item.owner.id,
                            avatar_url: item.owner.avatar_url,
                            login: item.owner.login,
                        },
                    };
                });
                setRepoArr([...repoArr, ...repoList]);
            }
        } else {
            const jsoned = await data.json();
            console.log(jsoned);
            if (jsoned.message) {
                // alert(jsoned.message);
            }
        }
    };

    useEffect(() => {
        fetchRepos();
        return () => myAbortController.abort();
    }, [pageNumber]);

    const handleContainerOnBottom = useCallback(() => {
        console.log(
            "I am at bottom in optional container! " +
                Math.round(performance.now())
        );

        setPageNumber((x) => x + 1);
    }, []);

    useBottomScrollListener(handleContainerOnBottom);

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
            <div className={"mainIconBox"}>
                <img
                    className={"mainIcon"}
                    src="https://i.ibb.co/51RKxtC/logo192.png"
                    alt="Star Icon"
                />
            </div>
            <div className={"titleBox"}>
                <h1>Most starred Github repos</h1>
                <h2>that were created in the last 30 days</h2>
            </div>
            <RepoList />
        </div>
    );
}

export default App;
