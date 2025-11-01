
import { describe, it, expect, } from 'vitest'
import { render, waitFor, screen } from '@testing-library/react';
import React, { act, createContext, useContext } from 'react';
import { userEvent } from '@testing-library/user-event'


const App = () => {
    return (
        <Home />
    )
}

const Home = () => {
    const [state, setState] = React.useState(0);
    return <h1>Hello World</h1>
}

// describe("Home", () => {
//     it("renders the Home component", async () => {
//         render(<App />);
//         await userEvent.click(screen.getByText(/hello world/i));
//         await waitFor(() => screen.getByText(/hello world/i));
//         expect(await screen.findByText(/hello world/i)).toBeInTheDocument();
//
//     });
// });
//

describe('A truthy statement', () => {
    it('should be equal to 2', () => {
        expect(1 + 1).toEqual(2)
    })
})
