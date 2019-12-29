import Header from "./components/Header";

const store = configureStore();


const App = () => (
    <Provider store={store} >
        <Router>
            <React.Fragment>
                <Header />
                <Route exact path="/" component={ListView} />
                <Route path="/view/:id" component={DetailView} />
                <Route path="/history/:id" component={HistoryView} />
                <Route path="/edit/:id" component={DetailView} />
                <Route path="/new" component={DetailView} />
            </React.Fragment>
       </Router>
    </Provider>
);

export default App;

